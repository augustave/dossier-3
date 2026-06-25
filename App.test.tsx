import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';
import { InquiryPanel } from './components/InquiryPanel';

/** Helper: find the accessible toggle button inside a module section. */
const getModuleToggle = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  return section?.querySelector<HTMLButtonElement>('button[aria-expanded]') ?? null;
};

describe('CT Dossier: recruiter-facing layout and IA', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
  });

  it('starts fully folded when no hash is present', async () => {
    render(<App />);

    // Dossier opens closed. No auto-hash, no module expanded.
    await waitFor(() => {
      expect(window.location.hash).toBe('');
    });
    expect(getModuleToggle('module-00')?.getAttribute('aria-expanded')).toBe('false');
    expect(getModuleToggle('module-01')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('honors an initial #module-03 hash on mount', async () => {
    window.location.hash = '#module-03';
    render(<App />);

    await waitFor(() => {
      const toggle = getModuleToggle('module-03');
      expect(toggle).not.toBeNull();
      expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    });

    // Other modules should remain collapsed
    expect(getModuleToggle('module-01')?.getAttribute('aria-expanded')).toBe('false');
    expect(getModuleToggle('module-02')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('waits for target geometry before opening when scrollend is unavailable', async () => {
    vi.useFakeTimers();
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let module03Top = 700;
    const rect = (top: number) => ({
      x: 0,
      y: top,
      top,
      left: 0,
      right: 100,
      bottom: top + 100,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    });

    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.getBoundingClientRect = function () {
      if ((this as Element).id === 'module-03') return rect(module03Top) as DOMRect;
      return originalGetBoundingClientRect.call(this);
    };

    try {
      render(<App />);

      fireEvent.click(getModuleToggle('module-03')!);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(560);
      });
      expect(getModuleToggle('module-03')?.getAttribute('aria-expanded')).toBe('false');

      module03Top = 100;
      await act(async () => {
        await vi.advanceTimersByTimeAsync(90);
      });
      expect(getModuleToggle('module-03')?.getAttribute('aria-expanded')).toBe('true');
    } finally {
      Element.prototype.scrollIntoView = originalScrollIntoView;
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      vi.useRealTimers();
    }
  });

  it('shows Header/Footer CTA as REQUEST CONVERSATION', () => {
    render(<App />);
    const ctas = screen.getAllByText(/REQUEST CONVERSATION/i);
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Footer with correct text', () => {
    render(<App />);
    expect(screen.getAllByText(/CT DOSSIER/i).length).toBeGreaterThanOrEqual(1);
    // Version label is wired to COPY.meta.version (QA fix 2026-06-12) — assert
    // against the source of truth, not a literal, so this never goes stale.
    // Version now appears in both the header chrome and the footer colophon.
    const expected = new RegExp(`v${COPY.meta.version.replace(/\./g, '\\.')} · NO API`, 'i');
    expect(screen.getAllByText(expected).length).toBeGreaterThanOrEqual(1);
    // Colophon (V3.6.10): CORRESPONDENCE label + the small closing seal. The old
    // large serif closing sentences are retired.
    expect(screen.getByText(/CORRESPONDENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Doctrine · Evidence · Conversation/i)).toBeInTheDocument();
    expect(screen.queryByText(/The conversation is where fit is tested/i)).not.toBeInTheDocument();
  });

  it('leads with the taste thesis and the art-director role line', () => {
    render(<App />);
    // V3 reposition: taste is the subject; the recruiter "Target Roles" block is gone.
    // (The phrase also appears in the Taste beliefs list, so scope to the hero heading.)
    expect(screen.getByRole('heading', { name: /sourcing discipline/i })).toBeInTheDocument();
    // Role line appears in the hero and again in the footer colophon.
    expect(screen.getAllByText(/Art Director · Design Engineer/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/Target Roles/i)).not.toBeInTheDocument();
  });

  it('does NOT show an Evidence Locker', () => {
    render(<App />);
    const evidenceLink = screen.queryByText(/EVIDENCE LOCKER/i);
    expect(evidenceLink).not.toBeInTheDocument();
  });
});

describe('Manifest overlay', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
  });

  it('opens from the INDEX button and renders the module order (00–08)', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/INDEX \(09\)/i));

    const items = await screen.findAllByTestId('manifest-item');
    const order = items.map(el => el.getAttribute('data-index'));
    expect(order).toEqual(['00', '01', '02', '03', '04', '05', '06', '07', '08']);
  });

  it('closes when the Close Index button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/INDEX \(09\)/i));

    const closeBtn = await screen.findByRole('button', { name: /Close Index/i });
    fireEvent.click(closeBtn);

    // ManifestOverlay keeps isVisible true for 500ms before unmounting; wait it out.
    await waitFor(
      () => {
        expect(screen.queryAllByTestId('manifest-item').length).toBe(0);
      },
      { timeout: 1500 }
    );
  });
});

describe('Conversation CTA (V3.6.1 mailto unify)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
  });

  it('REQUEST CONVERSATION is a prefilled mailto link, not a modal', () => {
    render(<App />);
    // No inquiry dialog mounts anymore — the CTA is a direct mailto.
    expect(screen.queryByRole('dialog', { name: /Inquiry/i })).not.toBeInTheDocument();

    const cta = screen.getByText(/REQUEST CONVERSATION/i).closest('a');
    expect(cta).not.toBeNull();
    const href = cta!.getAttribute('href') ?? '';
    expect(href).toMatch(/^mailto:ebenz\.aug@gmail\.com\?subject=/);
    expect(href).toContain('Conversation%20Request');
    expect(cta).toHaveAttribute('aria-label', expect.stringMatching(/request a conversation/i));
  });

  it('footer Compose Inquiry opens the same conversation mailto', () => {
    render(<App />);
    const compose = screen.getByText(/Compose Inquiry/i).closest('a');
    expect(compose).not.toBeNull();
    expect(compose!.getAttribute('href')).toMatch(/^mailto:ebenz\.aug@gmail\.com\?subject=/);
  });

  it('footer email link points at the contact address', () => {
    render(<App />);
    const email = screen.getByText(/^ebenz\.aug@gmail\.com$/i).closest('a');
    expect(email!.getAttribute('href')).toMatch(/^mailto:ebenz\.aug@gmail\.com/);
  });
});

describe('Inquiry dialog (component, contactEmail branches)', () => {
  it('enables the EMAIL DRAFT button when contactEmail is provided', async () => {
    const noop = () => {};
    render(
      <InquiryPanel
        isOpen={true}
        onClose={noop}
        context="Test Context"
        contactEmail="team@example.com"
      />
    );

    const dialog = await screen.findByRole('dialog', { name: /Inquiry/i });
    const emailButton = within(dialog).getByRole('button', { name: /EMAIL DRAFT/i });
    expect(emailButton).toBeEnabled();
    expect(within(dialog).queryByText(/Set VITE_CONTACT_EMAIL/i)).not.toBeInTheDocument();
  });

  it('traps Tab focus inside the dialog (shift+Tab from first element cycles to last)', async () => {
    const noop = () => {};
    render(
      <InquiryPanel
        isOpen={true}
        onClose={noop}
        context="Trap Test"
        contactEmail="team@example.com"
      />
    );

    const dialog = await screen.findByRole('dialog', { name: /Inquiry/i });

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && !el.hasAttribute('hidden') && el.tabIndex !== -1);

    expect(focusable.length).toBeGreaterThan(1);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first.focus();
    expect(first).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('sets window.location.href to a mailto URL when EMAIL DRAFT is clicked', async () => {
    const noop = () => {};
    const origLocation = window.location;

    // Replace window.location so we can capture the href assignment in jsdom.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    delete w.location;
    w.location = { ...origLocation, href: '' };

    render(
      <InquiryPanel
        isOpen={true}
        onClose={noop}
        context="Test Context"
        contactEmail="team@example.com"
      />
    );

    const dialog = await screen.findByRole('dialog', { name: /Inquiry/i });
    const emailBtn = within(dialog).getByRole('button', { name: /EMAIL DRAFT/i });
    fireEvent.click(emailBtn);

    expect(window.location.href).toMatch(/^mailto:team@example\.com\?subject=.+&body=.+/);

    // Restore
    w.location = origLocation;
  });
});

describe('Crease Map (V3.6.8 route bands, no filter)', () => {
  const ALL = ['00', '01', '02', '03', '04', '05', '06', '07', '08'];

  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
  });

  const band = (value: string) => screen.getByTestId(`route-band-${value}`);

  it('root shows the bet + 5 folded route bands + all 9 modules; no default route', async () => {
    render(<App />);
    expect(await screen.findByTestId('crease-map')).toBeInTheDocument();
    expect(screen.getByText(/THE BRAIN IS THE PRODUCT/i)).toBeInTheDocument();
    ['hiring', 'client', 'collab', 'acad', 'full'].forEach(v => expect(band(v)).toBeInTheDocument());
    expect(screen.queryByTestId('route-stamp')).toBeNull();
    expect(screen.queryByRole('button', { name: /Enter the recommended reading/i })).toBeNull();
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
  });

  it('selecting a band unfolds its stamp; the other routes stay as compact seams', async () => {
    render(<App />);
    await screen.findByTestId('crease-map');

    fireEvent.click(band('client'));

    await waitFor(() => expect(window.location.search).toContain('read=client'));
    expect(screen.getByTestId('route-stamp')).toBeInTheDocument();
    expect(screen.getByTestId('route-stamp-path').textContent).toBe('00 → 01 → 03 → 05 → 07');
    // Every route band stays visible (clickable seam) — none folds away.
    ['hiring', 'client', 'collab', 'acad', 'full'].forEach(v => expect(band(v)).toBeInTheDocument());
    // Only the selected route's detail panel is open.
    expect(screen.getByTestId('route-panel-client').getAttribute('data-open')).toBe('true');
    expect(screen.getByTestId('route-panel-hiring').getAttribute('data-open')).toBe('false');
    expect(screen.getAllByTestId('route-stamp')).toHaveLength(1);
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
    expect(document.querySelector('.fold[data-open="true"]')).toBeNull();
  });

  it('clicking the active route again returns to neutral and clears ?read', async () => {
    render(<App />);
    await screen.findByTestId('crease-map');
    fireEvent.click(band('hiring'));
    await screen.findByTestId('route-stamp');
    expect(window.location.search).toContain('read=hiring');

    // Clicking the active route's seam again folds the stamp + clears the route.
    fireEvent.click(band('hiring'));

    await waitFor(() => expect(screen.queryByTestId('route-stamp')).toBeNull());
    expect(window.location.search).not.toContain('read=');
    // All routes remain visible as seams (no trap).
    ['hiring', 'client', 'collab', 'acad', 'full'].forEach(v => expect(band(v)).toBeInTheDocument());
  });

  it('?read=client deep-link shows the stamp + all 9 modules; Index marks RECOMMENDED, hides nothing', async () => {
    window.history.replaceState(null, '', '?read=client');
    render(<App />);

    const stamp = await screen.findByTestId('route-stamp');
    expect(screen.getByTestId('route-stamp-path').textContent).toBe('00 → 01 → 03 → 05 → 07');
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());

    fireEvent.click(screen.getByText(/INDEX \(09\)/i));
    const items = await screen.findAllByTestId('manifest-item');
    expect(items).toHaveLength(9);
    const recd = ['00', '01', '03', '05', '07'];
    items.forEach(row => {
      const idx = row.getAttribute('data-index')!;
      const marker = within(row).queryByText(/^recommended$/i);
      if (recd.includes(idx)) expect(marker).toBeInTheDocument();
      else expect(marker).not.toBeInTheDocument();
    });
  });

  it('accepts the long-form ?read=collaborator alias', async () => {
    window.history.replaceState(null, '', '?read=collaborator');
    render(<App />);
    const stamp = await screen.findByTestId('route-stamp');
    expect(screen.getByTestId('route-stamp-path').textContent).toBe('00 → 02 → 03 → 04 → 06');
  });

  it('Full Dossier is the neutral flat sheet — clicking it clears ?read, no stamp, nothing recommended', async () => {
    render(<App />);
    await screen.findByTestId('crease-map');
    // Select a real route first, then click Full Dossier to return to neutral.
    fireEvent.click(band('client'));
    await waitFor(() => expect(window.location.search).toContain('read=client'));

    fireEvent.click(band('full'));
    await waitFor(() => expect(window.location.search).not.toContain('read='));
    expect(screen.queryByTestId('route-stamp')).toBeNull();
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());

    fireEvent.click(screen.getByText(/INDEX \(09\)/i));
    const items = await screen.findAllByTestId('manifest-item');
    expect(items).toHaveLength(9);
    items.forEach(row => expect(within(row).queryByText(/^recommended$/i)).not.toBeInTheDocument());
  });

  it('?read=full is treated as neutral — stripped to / with no stamp', async () => {
    window.history.replaceState(null, '', '?read=full');
    render(<App />);
    await screen.findByTestId('crease-map');
    expect(screen.queryByTestId('route-stamp')).toBeNull();
    await waitFor(() => expect(window.location.search).not.toContain('read='));
  });

  it('?read=30s is retired — redirects to the neutral overview (param stripped)', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);
    await screen.findByTestId('crease-map');
    expect(screen.queryByTestId('route-stamp')).toBeNull();
    expect(screen.getByTestId('route-band-hiring')).toBeInTheDocument();
    await waitFor(() => expect(window.location.search).not.toContain('read='));
  });

  it('with no route the Index lists all 9 with no recommended markers', async () => {
    render(<App />);
    await screen.findByTestId('crease-map');
    fireEvent.click(screen.getByText(/INDEX \(09\)/i));
    const items = await screen.findAllByTestId('manifest-item');
    expect(items).toHaveLength(9);
    items.forEach(row => expect(within(row).queryByText(/^recommended$/i)).not.toBeInTheDocument());
  });

  it('Back steps within the dossier: module → route → overview (popstate resync)', async () => {
    window.history.replaceState(null, '', '?read=client#module-03');
    render(<App />);
    // Deep-link opens 03 + stamps the client route.
    await waitFor(() => expect(getModuleToggle('module-03')?.getAttribute('aria-expanded')).toBe('true'));
    await screen.findByTestId('route-stamp');

    // Back to ?read=client → module closes, route persists (not an exit).
    act(() => {
      window.history.pushState(null, '', '?read=client');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await waitFor(() => expect(getModuleToggle('module-03')?.getAttribute('aria-expanded')).toBe('false'));
    expect(screen.getByTestId('route-stamp')).toBeInTheDocument();

    // Back to / → route clears, neutral overview (bands return).
    act(() => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await waitFor(() => expect(screen.queryByTestId('route-stamp')).toBeNull());
    expect(screen.getByTestId('route-band-client')).toBeInTheDocument();
  });
});


describe('Visual Languages (module 03)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
    // Open Module 03 (VISUAL LANGUAGES) so its language cards render for query.
    window.location.hash = '#module-03';
  });

  it('renders the two authored visual language cards (no IAA, no register filter)', async () => {
    render(<App />);
    const m3 = () => document.getElementById('module-03') as HTMLElement;

    await waitFor(() => {
      expect(within(m3()).getByText(/^DOSSIER$/)).toBeInTheDocument();
    });
    expect(within(m3()).getByText(/^DEADLIGHT$/)).toBeInTheDocument();
    // IAA card removed.
    expect(within(m3()).queryByText(/^IAA$/)).not.toBeInTheDocument();

    // REGISTER GRAMMAR filter strip removed — no register toggle buttons. The
    // registers survive only as colored tags (spans), still labelled.
    expect(within(m3()).queryByRole('button', { name: /MONASTERY/i })).not.toBeInTheDocument();
    expect(within(m3()).getAllByText(/FORGE/i).length).toBeGreaterThan(0);
  });
});

describe('Doctrine Library (module 06)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
    window.location.hash = '#module-06';
  });

  it('renders the doctrine shelf with its source-text cards (no register filter)', async () => {
    render(<App />);
    const m6 = () => document.getElementById('module-06') as HTMLElement;

    await waitFor(() => {
      expect(within(m6()).getByText('Design Under Fire')).toBeInTheDocument();
    });
    expect(within(m6()).getByText('Dirty Canvas')).toBeInTheDocument();

    // Removed cards: IAA (both), Watchman, Rubric, Hospitaller (both).
    expect(within(m6()).queryByText('IAA Manifesto')).not.toBeInTheDocument();
    expect(within(m6()).queryByText('IAA Brand Architecture')).not.toBeInTheDocument();
    expect(within(m6()).queryByText('The Watchman Builder')).not.toBeInTheDocument();
    expect(within(m6()).queryByText('Rubric Design System')).not.toBeInTheDocument();
    expect(within(m6()).queryByText('Hospitaller Codex')).not.toBeInTheDocument();
    expect(within(m6()).queryByText('Hospitaller Doctrine Brief')).not.toBeInTheDocument();

    // Register filter strip removed — no register toggle buttons.
    expect(within(m6()).queryByRole('button', { name: /^Oracle$/i })).not.toBeInTheDocument();
  });
});
