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
    // Colophon (V3.5.0): CORRESPONDENCE label + the closing doctrine line.
    expect(screen.getByText(/CORRESPONDENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/The conversation is where fit is tested/i)).toBeInTheDocument();
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

describe('Reading Lens (V3.6.1 orientation aid, not a filter)', () => {
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

  it('reads ?read=hiring on mount, activates the pill, and shows the helper path', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^HIRING MANAGER$/i });
    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('true');
    });

    // Orientation aid — every module stays present, nothing collapses out.
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
    // Helper copy is visible in the root Reading Lens strip, even while 00 is folded.
    expect(within(screen.getByTestId('reading-lens-strip')).getByText(/visual language, built evidence, and biography/i)).toBeInTheDocument();
    expect(document.querySelector('#module-00 .fold')?.getAttribute('data-open')).toBe('false');
  });

  it('clicking a pill writes ?read= to the URL and keeps every module visible', async () => {
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^CLIENT$/i });
    fireEvent.click(pill);

    await waitFor(() => {
      expect(window.location.search).toContain('read=client');
    });
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
    expect(within(screen.getByTestId('reading-lens-strip')).getByText(/taste, systems, doctrine, and built work/i)).toBeInTheDocument();
  });

  it('root Reading Lens strip visibly updates the shareable ?read= state', async () => {
    window.history.replaceState(null, '', '?read=acad');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    const academic = within(strip).getByRole('button', { name: 'Set reading lens: ACADEMIC' });
    await waitFor(() => {
      expect(academic.getAttribute('aria-pressed')).toBe('true');
    });
    expect(within(strip).getByText(/sourcing discipline, neighborhood map, doctrine, and library/i)).toBeInTheDocument();
    expect(document.querySelector('#module-00 .fold')?.getAttribute('data-open')).toBe('false');

    fireEvent.click(within(strip).getByRole('button', { name: 'Set reading lens: COLLABORATOR' }));

    await waitFor(() => {
      expect(window.location.search).toContain('read=collab');
    });
    expect(within(strip).getByText(/lenses, registers, neighboring practices, and source texts/i)).toBeInTheDocument();
  });

  it('clicking the active pill toggles it off and clears the helper', async () => {
    window.history.replaceState(null, '', '?read=acad');
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^ACADEMIC$/i });
    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('true');
    });

    fireEvent.click(pill);

    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('false');
    });
    expect(window.location.search).not.toContain('read=');
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
  });

  it('Show all button clears the active lens', async () => {
    window.history.replaceState(null, '', '?read=collab');
    render(<App />);

    const showAll = await screen.findByRole('button', { name: /Show all modules/i });
    fireEvent.click(showAll);

    await waitFor(() => {
      expect(window.location.search).not.toContain('read=');
    });
    ALL.forEach(idx => expect(getModuleToggle(`module-${idx}`)).not.toBeNull());
  });

  it('marks the lens path RECOMMENDED in the Index without hiding anything', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(09\)/i));
    const items = await screen.findAllByTestId('manifest-item');

    // Hiring path is 00,03,07,08 — each carries a Recommended marker.
    const recd = ['00', '03', '07', '08'];
    items.forEach(row => {
      const idx = row.getAttribute('data-index')!;
      const marker = within(row).queryByText(/^recommended$/i);
      if (recd.includes(idx)) {
        expect(marker).toBeInTheDocument();
      } else {
        expect(marker).not.toBeInTheDocument();
      }
    });
    // Index still lists all nine modules — orientation, not a filter.
    expect(items).toHaveLength(9);
  });

  it('shows the reading-path notation for the active lens (V3.6.5 route card)', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    expect(within(strip).getByTestId('reading-lens-path').textContent).toBe('00 → 03 → 07 → 08');
  });

  it('offers a START PATH action targeting the lens first module', async () => {
    window.history.replaceState(null, '', '?read=collab');
    render(<App />);

    const strip = await screen.findByTestId('reading-lens-strip');
    const start = within(strip).getByTestId('start-path');
    // Collaborator path 00 -> 02 -> … so START PATH opens module 02.
    expect(start.getAttribute('aria-label')).toMatch(/opens module 02/i);
    // No START PATH before a lens is chosen.
    fireEvent.click(within(strip).getByRole('button', { name: 'Set reading lens: COLLABORATOR' })); // toggle off
    await waitFor(() => {
      expect(within(strip).queryByTestId('start-path')).toBeNull();
    });
  });

  it('accepts the long-form ?read=collaborator alias', async () => {
    window.history.replaceState(null, '', '?read=collaborator');
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^COLLABORATOR$/i });
    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('true');
    });
  });

  it('Index rows expose accessible recommended/open state (PRD 9.3)', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    fireEvent.click(screen.getByText(/INDEX \(09\)/i));
    const items = await screen.findAllByTestId('manifest-item');
    const row03 = items.find(r => r.getAttribute('data-index') === '03')!;
    const row01 = items.find(r => r.getAttribute('data-index') === '01')!;
    expect(row03.getAttribute('aria-label')).toMatch(/recommended for HIRING MANAGER path/i);
    expect(row01.getAttribute('aria-label')).toBe('01 TASTE');
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
