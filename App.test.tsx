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

describe('Reading Lens (V3.6.9 route filter)', () => {
  // Every module index that must always remain on the page — the lens never hides.
  const ALL = ['00', '01', '02', '03', '04', '05', '06', '07', '08'];

  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
    // Reset search params before each test.
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
  });

  it('reads ?read=hiring on mount and collapses to a route stamp with CHANGE LENS', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    expect(within(strip).getByText(/Hiring Manager route · 4 of 9 modules shown/i)).toBeInTheDocument();
    expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 03 → 07 → 08');
    expect(within(strip).getByText(/visual language, built evidence, and biography/i)).toBeInTheDocument();
    // Stamp + a single CHANGE LENS control — the four tabs are gone.
    expect(within(strip).queryByRole('button', { name: 'Set reading lens: CLIENT' })).toBeNull();
    expect(within(strip).queryByRole('button', { name: 'Set reading lens: HIRING MANAGER' })).toBeNull();
    expect(within(strip).getByRole('button', { name: /Change reading lens/i })).toBeInTheDocument();
    expect(within(strip).getByRole('button', { name: /Show all modules/i })).toBeInTheDocument();
    expect(screen.getByText(/INDEX \(04 \/ 09\)/i)).toBeInTheDocument();
    expect(screen.queryByTestId('start-path')).toBeNull();

    // Lens FILTERS the stack — only the route's modules render; nothing auto-opens.
    ['00', '03', '07', '08'].forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
    ['01', '02', '04', '05', '06'].forEach(idx => expect(getModuleToggle(`module-${idx}`)).toBeNull());
    expect(document.querySelector('#module-00 .fold')?.getAttribute('data-open')).toBe('false');
  });

  it('CHANGE LENS reveals the four choices again and lets the reader switch', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    // Reveal the picker; current selection preserved, URL unchanged.
    fireEvent.click(within(strip).getByRole('button', { name: /Change reading lens/i }));
    expect(within(strip).getByText(/Hiring Manager selected · choose another route/i)).toBeInTheDocument();
    const collab = await within(strip).findByRole('button', { name: 'Set reading lens: COLLABORATOR' });
    expect(within(strip).getByRole('button', { name: 'Set reading lens: HIRING MANAGER' })).toBeInTheDocument();
    expect(within(strip).getByRole('button', { name: 'Set reading lens: HIRING MANAGER' }).getAttribute('aria-pressed')).toBe('true');
    expect(window.location.search).toContain('read=hiring');

    // Switch lens → re-collapses to the new route stamp.
    fireEvent.click(collab);
    await waitFor(() => {
      expect(window.location.search).toContain('read=collab');
    });
    expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 02 → 03 → 04 → 06');
    expect(within(strip).queryByRole('button', { name: 'Set reading lens: HIRING MANAGER' })).toBeNull();
  });

  it('with no lens shows the picker; selecting one writes ?read= and removes the picker', async () => {
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    expect(within(strip).getByText(/select a reading lens/i)).toBeInTheDocument();
    const client = within(strip).getByRole('button', { name: 'Set reading lens: CLIENT' });
    fireEvent.click(client);

    await waitFor(() => {
      expect(window.location.search).toContain('read=client');
    });
    // Stamp only — the picker is gone (not merely hidden).
    expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 01 → 03 → 05 → 07');
    expect(within(strip).queryByRole('button', { name: 'Set reading lens: HIRING MANAGER' })).toBeNull();
    // Client route filters the stack to 00,01,03,05,07.
    ['00', '01', '03', '05', '07'].forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
    ['02', '04', '06', '08'].forEach(idx => expect(getModuleToggle(`module-${idx}`)).toBeNull());
  });

  it('root All modules clears the active route and restores the full stack', async () => {
    window.history.replaceState(null, '', '?read=acad');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    expect(screen.getByText(/INDEX \(05 \/ 09\)/i)).toBeInTheDocument();
    fireEvent.click(within(strip).getByRole('button', { name: /Show all modules/i }));

    await waitFor(() => {
      expect(window.location.search).not.toContain('read=');
    });
    expect(screen.getByText(/INDEX \(09\)/i)).toBeInTheDocument();
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
  });

  it('renders the Reading Lens / Reading Path block exactly once (no module-00 duplicate)', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    await screen.findByTestId('reading-lens-strip');
    expect(screen.getAllByTestId('reading-lens-path')).toHaveLength(1);
    expect(screen.getAllByText(/Hiring Manager route · 4 of 9 modules shown/i)).toHaveLength(1);
  });

  it('the Index lists ONLY the active route modules (lens filters)', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(/i));
    const items = await screen.findAllByTestId('manifest-item');
    const indices = items.map(r => r.getAttribute('data-index')).sort();
    // Hiring route is 00,03,07,08 — the off-route modules are not listed.
    expect(indices).toEqual(['00', '03', '07', '08']);
    expect(screen.getByTestId('index-route-context')).toHaveTextContent(/Hiring Manager route · 4 of 9 modules shown/i);
  });

  it('All modules inside the Index clears the route and restores INDEX (09)', async () => {
    window.history.replaceState(null, '', '?read=acad');
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(05 \/ 09\)/i));
    expect(await screen.findByTestId('index-route-context')).toHaveTextContent(/Academic route · 5 of 9 modules shown/i);
    fireEvent.click(screen.getByRole('button', { name: /Show all modules from Index/i }));

    await waitFor(() => {
      expect(window.location.search).not.toContain('read=');
    });
    expect(screen.getByText(/INDEX \(09\)/i)).toBeInTheDocument();
    const items = await screen.findAllByTestId('manifest-item');
    expect(items).toHaveLength(9);
  });

  it('with no lens the Index lists every module', async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(/i));
    const items = await screen.findAllByTestId('manifest-item');
    expect(items).toHaveLength(9);
  });

  it('shows the reading-path notation for the active lens (V3.6.5 route card)', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 03 → 07 → 08');
  });

  it('exposes no START PATH action (removed in V3.6.6)', async () => {
    window.history.replaceState(null, '', '?read=collab');
    render(<App />);

    await screen.findByTestId('reading-lens-strip');
    expect(screen.queryByTestId('start-path')).toBeNull();
    expect(screen.queryByText(/start path/i)).toBeNull();
  });

  it('accepts the long-form ?read=collaborator alias', async () => {
    window.history.replaceState(null, '', '?read=collaborator');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    await waitFor(() => {
      expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 02 → 03 → 04 → 06');
    });
    expect(within(strip).getByText(/Collaborator route · 5 of 9 modules shown/i)).toBeInTheDocument();
  });

  it('opens module 04 using the masthead-safe scroll offset', async () => {
    const originalScrollTo = window.scrollTo;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, writable: true, value: scrollTo });
    Element.prototype.getBoundingClientRect = function () {
      if ((this as Element).id === 'module-04') {
        return {
          x: 0,
          y: 640,
          top: 640,
          left: 0,
          right: 100,
          bottom: 760,
          width: 100,
          height: 120,
          toJSON: () => ({}),
        } as DOMRect;
      }
      return originalGetBoundingClientRect.call(this);
    };

    try {
      window.history.replaceState(null, '', '?read=acad');
      render(<App />);
      scrollTo.mockClear();

      fireEvent.click(getModuleToggle('module-04')!);

      expect(scrollTo).toHaveBeenCalledWith({ top: 540, behavior: 'smooth' });
    } finally {
      Object.defineProperty(window, 'scrollTo', { configurable: true, writable: true, value: originalScrollTo });
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });

  it('Index row exposes accessible open state; off-route rows are absent', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(/i));
    const items = await screen.findAllByTestId('manifest-item');
    const row07 = items.find(r => r.getAttribute('data-index') === '07')!;
    expect(row07.getAttribute('aria-label')).toBe('07 PORTFOLIOS');
    // 01 TASTE is off the hiring route — not listed at all.
    expect(items.find(r => r.getAttribute('data-index') === '01')).toBeUndefined();
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

  it('renders the three authored visual language cards and the register grammar', async () => {
    render(<App />);
    const m3 = () => document.getElementById('module-03') as HTMLElement;

    await waitFor(() => {
      expect(within(m3()).getByText(/^DOSSIER$/)).toBeInTheDocument();
    });
    expect(within(m3()).getByText(/^DEADLIGHT$/)).toBeInTheDocument();
    expect(within(m3()).getByText(/^IAA$/)).toBeInTheDocument();

    // Register grammar present as toggle buttons, not a tab strip.
    expect(within(m3()).getByRole('button', { name: /MONASTERY/i })).toBeInTheDocument();
    expect(within(m3()).getByRole('button', { name: /FORGE/i })).toBeInTheDocument();
    expect(within(m3()).getByRole('button', { name: /ORACLE/i })).toBeInTheDocument();
  });

  it('toggles a register highlight when its grammar chip is clicked', async () => {
    render(<App />);
    const m3 = () => document.getElementById('module-03') as HTMLElement;

    const forge = await within(m3()).findByRole('button', { name: /FORGE/i });
    expect(forge.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(forge);
    expect(forge.getAttribute('aria-pressed')).toBe('true');
    // Clicking again clears it.
    fireEvent.click(forge);
    expect(forge.getAttribute('aria-pressed')).toBe('false');
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

  it('renders the doctrine shelf with its source-text cards', async () => {
    render(<App />);
    const m6 = () => document.getElementById('module-06') as HTMLElement;

    await waitFor(() => {
      expect(within(m6()).getByText('Design Under Fire')).toBeInTheDocument();
    });
    expect(within(m6()).getByText('The Watchman Builder')).toBeInTheDocument();
    expect(within(m6()).getByText('IAA Manifesto')).toBeInTheDocument();
    expect(within(m6()).getByText('IAA Brand Architecture')).toBeInTheDocument();
  });

  it('filters the shelf when a register chip is clicked', async () => {
    render(<App />);
    const m6 = () => document.getElementById('module-06') as HTMLElement;

    // Oracle filter hides Forge/Systems-only papers (Design Under Fire) and
    // keeps Oracle-tagged ones (Dirty Canvas).
    const oracleChip = await within(m6()).findByRole('button', { name: /^Oracle$/i });
    fireEvent.click(oracleChip);

    await waitFor(() => {
      expect(within(m6()).queryByText('Design Under Fire')).not.toBeInTheDocument();
    });
    expect(within(m6()).getByText('Dirty Canvas')).toBeInTheDocument();
  });
});

describe('Move 1 — 30s thesis screen (?read=30s)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
  });

  const enterButton = (value: string) =>
    within(document.getElementById(`lens-panel-${value}`) as HTMLElement)
      .getByRole('button', { name: /Enter this reading/i });

  it('renders the 30s screen with the folding lens selector instead of the stack', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);

    expect(await screen.findByRole('region', { name: /30 second read/i })).toBeInTheDocument();
    expect(screen.getByText(/I turn complex systems into visual languages/i)).toBeInTheDocument();
    // Folding lens selector: a card header per lens, Hiring open by default.
    expect(screen.getByRole('button', { name: /^Hiring Manager/i }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: /^Client/i }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('button', { name: /^Full Dossier/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Compose inquiry/i })).toBeInTheDocument();
    // The dossier stack is not rendered behind it.
    expect(document.querySelector('section[id^="module-"]')).toBeNull();
  });

  it('the Compose inquiry CTA is the prefilled conversation mailto', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);
    const compose = await screen.findByRole('link', { name: /Compose inquiry/i });
    expect(compose.getAttribute('href')).toMatch(/^mailto:.+\?subject=.+&body=.+/);
  });

  it('cards accordion — opening one folds the others (single open)', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);

    const hiring = await screen.findByRole('button', { name: /^Hiring Manager/i });
    const client = screen.getByRole('button', { name: /^Client/i });
    expect(hiring.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(client);
    expect(client.getAttribute('aria-expanded')).toBe('true');
    expect(hiring.getAttribute('aria-expanded')).toBe('false');

    // Reversible — clicking the open card's header folds it back to neutral.
    fireEvent.click(client);
    expect(client.getAttribute('aria-expanded')).toBe('false');
  });

  it('"Enter this reading" on the Hiring card routes to the hiring lens (filtered stack)', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);
    await screen.findByRole('region', { name: /30 second read/i });

    fireEvent.click(enterButton('hiring'));

    await waitFor(() => expect(window.location.search).toContain('read=hiring'));
    expect(screen.queryByRole('region', { name: /30 second read/i })).toBeNull();
    expect(getModuleToggle('module-03')).not.toBeNull();
    expect(getModuleToggle('module-01')).toBeNull();
  });

  it('"Enter this reading" on Full Dossier clears the lens (all modules, no ?read=)', async () => {
    window.history.replaceState(null, '', '?read=30s');
    render(<App />);
    await screen.findByRole('region', { name: /30 second read/i });

    fireEvent.click(enterButton('full'));

    await waitFor(() => expect(screen.queryByRole('region', { name: /30 second read/i })).toBeNull());
    expect(window.location.search).not.toContain('read=');
    ['00', '01', '02', '03', '04', '05', '06', '07', '08'].forEach(idx =>
      expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
  });

  it('an unknown ?read= value falls back to the default dossier (no 30s, no blank)', async () => {
    window.history.replaceState(null, '', '?read=zzz');
    render(<App />);

    expect(screen.queryByRole('region', { name: /30 second read/i })).toBeNull();
    expect(getModuleToggle('module-00')).not.toBeNull();
    expect(getModuleToggle('module-06')).not.toBeNull();
  });
});
