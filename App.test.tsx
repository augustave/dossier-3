import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

describe('Inquiry dialog (via App)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
  });

  it('opens the inquiry dialog, focuses the close button, and closes on Escape', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByText(/REQUEST CONVERSATION/i)[0]);

    const dialog = await screen.findByRole('dialog', { name: /Inquiry/i });
    const closeButton = within(dialog).getByRole('button', { name: /Close inquiry panel/i });
    // Contact-path fix (2026-06-10): email falls back to the hardcoded CONTACT
    // constant when no env override is set, so the button is always live.
    const emailButton = within(dialog).getByRole('button', { name: /EMAIL DRAFT/i });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
    expect(emailButton).toBeEnabled();

    fireEvent.keyDown(dialog, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Inquiry/i })).not.toBeInTheDocument();
    });
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

describe('Faceted audience entry', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
    // Reset search params before each test.
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
  });

  it('reads ?read=hiring on mount, activates pill, filters to modules 01/04/07', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^HIRING MANAGER$/i });
    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('true');
    });

    // Hiring audience: 01, 04, 07 present; the rest collapsed out.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-04')).not.toBeNull();
    expect(getModuleToggle('module-07')).not.toBeNull();
    expect(getModuleToggle('module-02')).toBeNull();
    expect(getModuleToggle('module-03')).toBeNull();
    expect(getModuleToggle('module-05')).toBeNull();
    expect(getModuleToggle('module-06')).toBeNull();
    expect(getModuleToggle('module-08')).toBeNull();
  });

  it('clicking a pill writes ?read= to the URL and filters the module list', async () => {
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^CLIENT$/i });
    fireEvent.click(pill);

    await waitFor(() => {
      expect(window.location.search).toContain('read=client');
    });

    // Client audience: 01, 03, 08 present; the rest collapsed out.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-03')).not.toBeNull();
    expect(getModuleToggle('module-08')).not.toBeNull();
    expect(getModuleToggle('module-02')).toBeNull();
    expect(getModuleToggle('module-04')).toBeNull();
    expect(getModuleToggle('module-05')).toBeNull();
    expect(getModuleToggle('module-06')).toBeNull();
    expect(getModuleToggle('module-07')).toBeNull();
  });

  it('clicking the active pill toggles it off and restores all seven modules', async () => {
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
    // All eight modules are present after clearing.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-02')).not.toBeNull();
    expect(getModuleToggle('module-03')).not.toBeNull();
    expect(getModuleToggle('module-04')).not.toBeNull();
    expect(getModuleToggle('module-05')).not.toBeNull();
    expect(getModuleToggle('module-06')).not.toBeNull();
    expect(getModuleToggle('module-07')).not.toBeNull();
    expect(getModuleToggle('module-08')).not.toBeNull();
  });

  it('Show all button clears the active audience and restores all seven modules', async () => {
    window.history.replaceState(null, '', '?read=collab');
    render(<App />);

    const showAll = await screen.findByRole('button', { name: /Show all modules/i });
    fireEvent.click(showAll);

    await waitFor(() => {
      expect(window.location.search).not.toContain('read=');
    });
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-04')).not.toBeNull();
    expect(getModuleToggle('module-06')).not.toBeNull();
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
