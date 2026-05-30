import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';
import { InquiryPanel } from './components/InquiryPanel';
import { Simulator } from './components/Simulator';

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

  it('defaults to module 01 when no hash is present', async () => {
    render(<App />);

    await waitFor(() => {
      expect(window.location.hash).toBe('#module-01');
    });
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
    expect(screen.getByText(/v1\.2\.0 \+ NO API/i)).toBeInTheDocument();
  });

  it('shows a target roles block near the top of the page', () => {
    render(<App />);
    const rolesHeading = screen.getByText(/Target Roles/i);
    const rolesSection = rolesHeading.closest('section') as HTMLElement;
    expect(rolesSection).not.toBeNull();
    expect(within(rolesSection).getByText(/^Creative Technologist$/i)).toBeInTheDocument();
    expect(within(rolesSection).getByText(/^Visual Designer, Defense$/i)).toBeInTheDocument();
  });

  it('does NOT show Module 06 / Evidence Locker', () => {
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

  it('opens from the INDEX button and renders the expected module order (02, 01, 03, 04, 05, 06)', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/INDEX \(00\)/i));

    const items = await screen.findAllByTestId('manifest-item');
    const order = items.map(el => el.getAttribute('data-index'));
    expect(order).toEqual(['02', '01', '03', '04', '05', '06']);
  });

  it('closes when the Close Index button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/INDEX \(00\)/i));

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
    const emailButton = within(dialog).getByRole('button', { name: /EMAIL DISABLED/i });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
    expect(emailButton).toBeDisabled();

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

describe('Simulator component', () => {
  it('renders with default selections (SYSTEMS + PRODUCT) showing CREATIVE TECHNOLOGIST', () => {
    const onInquiry = vi.fn();
    render(<Simulator onInquiryRequest={onInquiry} />);

    expect(screen.getByText('CREATIVE TECHNOLOGIST')).toBeInTheDocument();
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();

    // Verify input controls rendered
    expect(screen.getByText('NARRATIVE')).toBeInTheDocument();
    expect(screen.getByText('SYSTEMS')).toBeInTheDocument();
    expect(screen.getByText('EXECUTION')).toBeInTheDocument();
    expect(screen.getByText('CONCEPT')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT')).toBeInTheDocument();
    expect(screen.getByText('MISSION')).toBeInTheDocument();
  });

  it('updates archetype when selections change', () => {
    const onInquiry = vi.fn();
    render(<Simulator onInquiryRequest={onInquiry} />);

    // Switch to NARRATIVE + MISSION → OPERATIONAL STORYTELLER
    fireEvent.click(screen.getByText('NARRATIVE'));
    fireEvent.click(screen.getByText('MISSION'));

    expect(screen.getByText('OPERATIONAL STORYTELLER')).toBeInTheDocument();
  });

  it('fires onInquiryRequest when Discuss this fit is clicked', () => {
    const onInquiry = vi.fn();
    render(<Simulator onInquiryRequest={onInquiry} />);

    fireEvent.click(screen.getByText(/Discuss this fit/i));
    expect(onInquiry).toHaveBeenCalledWith('Role Matrix: CREATIVE TECHNOLOGIST');
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

  it('reads ?read=hiring on mount, activates pill, filters to modules 01/02/05', async () => {
    window.history.replaceState(null, '', '?read=hiring');
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^HIRING MANAGER$/i });
    await waitFor(() => {
      expect(pill.getAttribute('aria-pressed')).toBe('true');
    });

    // Hiring audience: 01, 02, 05 present; 03, 04, 06 collapsed out.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-02')).not.toBeNull();
    expect(getModuleToggle('module-05')).not.toBeNull();
    expect(getModuleToggle('module-03')).toBeNull();
    expect(getModuleToggle('module-04')).toBeNull();
    expect(getModuleToggle('module-06')).toBeNull();
  });

  it('clicking a pill writes ?read= to the URL and filters the module list', async () => {
    render(<App />);

    const pill = await screen.findByRole('button', { name: /^CLIENT$/i });
    fireEvent.click(pill);

    await waitFor(() => {
      expect(window.location.search).toContain('read=client');
    });

    // Client audience: 01, 03, 05 present; 02, 04, 06 collapsed out.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-03')).not.toBeNull();
    expect(getModuleToggle('module-05')).not.toBeNull();
    expect(getModuleToggle('module-02')).toBeNull();
    expect(getModuleToggle('module-04')).toBeNull();
    expect(getModuleToggle('module-06')).toBeNull();
  });

  it('clicking the active pill toggles it off and restores all six modules', async () => {
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
    // All six modules are present after clearing.
    expect(getModuleToggle('module-01')).not.toBeNull();
    expect(getModuleToggle('module-02')).not.toBeNull();
    expect(getModuleToggle('module-03')).not.toBeNull();
    expect(getModuleToggle('module-04')).not.toBeNull();
    expect(getModuleToggle('module-05')).not.toBeNull();
    expect(getModuleToggle('module-06')).not.toBeNull();
  });

  it('Show all button clears the active audience and restores all six modules', async () => {
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

describe('Doctrine in motion explorer (Module 03)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
    // Open Module 03 so its content renders for query.
    // (Explorer lives in Module 03 per war-game restructure; was Module 02.)
    window.location.hash = '#module-03';
  });

  it('renders the first register by default and swaps when a different tab is clicked', async () => {
    render(<App />);

    // Coldwater (CW) is first in the registers array — its thesis is the default.
    await waitFor(() => {
      expect(screen.getByText(/The ocean doesn't care about your DoD rating/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Spectrum is terrain/i)).not.toBeInTheDocument();

    // Click the Anechoic tab.
    const anTab = screen.getByRole('tab', { name: /^AN/ });
    fireEvent.click(anTab);

    await waitFor(() => {
      expect(screen.getByText(/Spectrum is terrain/i)).toBeInTheDocument();
    });
    // Coldwater's thesis is gone after swap.
    expect(screen.queryByText(/The ocean doesn't care about your DoD rating/i)).not.toBeInTheDocument();
  });
});
