import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';
import { CT_DOSSIER_COPY_V120 as COPY } from './copy.v1_1';

/** Find the accessible toggle button inside a module section. */
const getModuleToggle = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  return section?.querySelector<HTMLButtonElement>('button[aria-expanded]') ?? null;
};

/** Open a fold and wait for it to report expanded; return its section element. */
const openModule = async (sectionId: string) => {
  fireEvent.click(getModuleToggle(sectionId)!);
  await waitFor(() =>
    expect(getModuleToggle(sectionId)?.getAttribute('aria-expanded')).toBe('true')
  );
  return document.getElementById(sectionId)!;
};

describe('CT Dossier V4 — five-section swap spine', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
    window.location.hash = '';
  });

  // --- Frame + spine -------------------------------------------------------

  it('leads with the thesis THE BRAIN IS THE PRODUCT', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /THE BRAIN IS THE PRODUCT/i })
    ).toBeInTheDocument();
  });

  it('renders the six strata sections in order (cover + five folds)', () => {
    render(<App />);
    // Titles render as per-character SplitFlap spans in the main view, so assert
    // the sections themselves (stable ids + aria-labels), plus the INDEX count.
    ['00', '01', '02', '03', '04', '05'].forEach((idx) => {
      expect(document.getElementById(`module-${idx}`)).not.toBeNull();
    });
    expect(screen.getByRole('region', { name: /Module 01: BIO/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Module 04: AMERICAN DYNAMISM/i })).toBeInTheDocument();
    // INDEX count = the six rendered strata (cover + five folds).
    expect(screen.getByText(/INDEX \(06\)/i)).toBeInTheDocument();
  });

  it('retired the old taste-led folds', () => {
    render(<App />);
    expect(screen.queryByText(/^TASTE$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^VISUAL LANGUAGES$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DOCTRINE LIBRARY/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^PORTFOLIOS$/)).not.toBeInTheDocument();
  });

  it('removed the reading-route selector but kept the thesis frame', () => {
    render(<App />);
    expect(screen.queryByText(/^Read as —$/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('route-band-hiring')).not.toBeInTheDocument();
  });

  // --- Fold content --------------------------------------------------------

  it('BIO carries the name and the neighborhood map', async () => {
    render(<App />);
    const sec = await openModule('module-01');
    expect(within(sec).getByText(COPY.modules.bio.name)).toBeInTheDocument();
    expect(within(sec).getByText(/A MAP OF NEIGHBORING PRACTICES/i)).toBeInTheDocument();
    // The neighborhood map is now the interactive artifact, embedded as an iframe.
    expect(
      sec.querySelector('iframe[title*="neighboring practices"]')
    ).toBeInTheDocument();
    // My First CPO article link.
    expect(
      within(sec).getByRole('link', { name: /My First CPO/i })
    ).toHaveAttribute('href', COPY.modules.bio.article.href);
  });

  it('INFLUENCES embeds the Index of Influences astrolabe', async () => {
    // The lineage atlas was replaced by the FERRIS widget, embedded as an iframe.
    render(<App />);
    const sec = await openModule('module-02');
    expect(
      sec.querySelector('iframe[title*="Index of Influences"]')
    ).toBeInTheDocument();
  });

  it('AI shows the statement and the Five Axioms including Axiom V', async () => {
    render(<App />);
    const sec = await openModule('module-03');
    // V4.0.1 copy patch: statement re-cut to "changes where creativity lives".
    expect(within(sec).getByText(/changes where creativity lives/i)).toBeInTheDocument();
    // Exact — avoid also matching the "THE FIVE AXIOMS OF …" title.
    expect(within(sec).getByText(/^Five axioms$/i)).toBeInTheDocument();
    expect(within(sec).getByText(/Relentless Innovation/i)).toBeInTheDocument(); // I
    expect(within(sec).getByText(/Visual Impact/i)).toBeInTheDocument();          // V
    // AI now carries only the DIRTY tool — Branding / AGI moved to BRAND.
    expect(within(sec).getByText(/^DIRTY$/)).toBeInTheDocument();
    expect(within(sec).queryByText(/Branding \/ AGI/i)).not.toBeInTheDocument();
  });

  it('AMERICAN DYNAMISM links to the defense pieces and the two papers', async () => {
    render(<App />);
    const sec = await openModule('module-04');
    expect(within(sec).getByText('Hand of God')).toBeInTheDocument();
    expect(within(sec).getByText('American Dynamo')).toBeInTheDocument();
    expect(within(sec).getByText('White Girls')).toBeInTheDocument();
    expect(within(sec).getByText('Under Fire')).toBeInTheDocument();
    expect(within(sec).getByText('Creative Strategy')).toBeInTheDocument();
    expect(
      within(sec).getByRole('link', { name: /Hand of God/i })
    ).toHaveAttribute('href', 'https://augustave.github.io/HANDOFGOD');
  });

  it('AMERICAN DYNAMISM doctrine plates open, step and close', async () => {
    render(<App />);
    const sec = await openModule('module-04');
    // Strip renders: eyebrow + ten tokens, all closed.
    expect(within(sec).getByText(/DOCTRINE PLATES/i)).toBeInTheDocument();
    const tokens = within(sec).getAllByRole('button', { name: /^Plate \d\d —/i });
    expect(tokens).toHaveLength(10);
    expect(within(sec).queryByRole('region', { name: /^Plate/i })).not.toBeInTheDocument();
    // Click (01) → viewer region with image; token marked expanded.
    fireEvent.click(tokens[0]);
    expect(tokens[0]).toHaveAttribute('aria-expanded', 'true');
    const viewer = within(sec).getByRole('region', { name: /Plate 01 — THE AESTHETICS OF ALGORITHMIC WARFARE/i });
    expect(viewer.querySelector('img')?.getAttribute('src')).toBe('dynamism/plate-01.jpg');
    // ArrowRight = discrete jump to plate 02.
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(within(sec).getByRole('region', { name: /Plate 02/i })).toBeInTheDocument();
    // Escape closes instantly; cards above untouched.
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(within(sec).queryByRole('region', { name: /^Plate/i })).not.toBeInTheDocument();
    expect(within(sec).getByText('Hand of God')).toBeInTheDocument();
  });

  it('BRAND shows the Branding / AGI link', async () => {
    render(<App />);
    const sec = await openModule('module-05');
    expect(within(sec).getByText(/Branding \/ AGI/i)).toBeInTheDocument();
    expect(within(sec).queryByText('Under Fire')).not.toBeInTheDocument();
  });

  // --- Chrome --------------------------------------------------------------

  it('shows the REQUEST CONVERSATION CTA', () => {
    render(<App />);
    expect(screen.getAllByText(/REQUEST CONVERSATION/i).length).toBeGreaterThanOrEqual(1);
  });

  it('footer carries the wired version, correspondence, and role line', () => {
    render(<App />);
    const re = new RegExp(`v${COPY.meta.version.replace(/\./g, '\\.')} · NO API`, 'i');
    expect(screen.getAllByText(re).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/CORRESPONDENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Doctrine · Evidence · Conversation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Art Director · Design Engineer/i).length).toBeGreaterThanOrEqual(1);
  });

  it('INDEX overlay lists the six strata with their PRD titles', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /INDEX \(/i }));
    await waitFor(() => expect(screen.getAllByTestId('manifest-item').length).toBe(6));
    // The overlay renders each title as a whole text node (no SplitFlap).
    // V4.0.1: BIO→BIOGRAPHY, AI→ARTIFICIAL INTELLIGENCE (owner rename).
    ['FRONT MATTER', 'BIOGRAPHY', 'INFLUENCES', 'ARTIFICIAL INTELLIGENCE', 'AMERICAN DYNAMISM', 'BRAND'].forEach((t) => {
      expect(screen.getByText(new RegExp(`^${t}$`, 'i'))).toBeInTheDocument();
    });
  });

  // --- Interaction / choreography -----------------------------------------

  it('starts fully folded when no hash is present', async () => {
    render(<App />);
    await waitFor(() => expect(window.location.hash).toBe(''));
    expect(getModuleToggle('module-00')?.getAttribute('aria-expanded')).toBe('false');
    expect(getModuleToggle('module-01')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('honors an initial #module-03 hash on mount', async () => {
    window.location.hash = '#module-03';
    render(<App />);
    await waitFor(() =>
      expect(getModuleToggle('module-03')?.getAttribute('aria-expanded')).toBe('true')
    );
    expect(getModuleToggle('module-01')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a fold on click and closes it on a second click', async () => {
    render(<App />);
    fireEvent.click(getModuleToggle('module-02')!);
    await waitFor(() =>
      expect(getModuleToggle('module-02')?.getAttribute('aria-expanded')).toBe('true')
    );
    fireEvent.click(getModuleToggle('module-02')!);
    await waitFor(() =>
      expect(getModuleToggle('module-02')?.getAttribute('aria-expanded')).toBe('false')
    );
  });

  it('waits for target geometry before opening when scrollend is unavailable', async () => {
    vi.useFakeTimers();
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let module03Top = 700;
    const rect = (top: number) => ({
      x: 0, y: top, top, left: 0, right: 100, bottom: top + 100,
      width: 100, height: 100, toJSON: () => ({}),
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
});
