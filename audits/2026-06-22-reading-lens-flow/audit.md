# CT DOSSIER Reading Lens Flow Audit

Date: 2026-06-22
Surface: localhost CT DOSSIER, desktop viewport
Mode: Combined UX/design/accessibility audit from captured screenshots

## Audit Scope

This audit covers the current V3.6.9 Reading Lens and stack flow:

1. Root full-stack state
2. Academic lens selected
3. Academic route Index
4. Change Lens picker
5. Neighborhood opened from the Academic route

Evidence files:

- `01-root-full-stack.png`
- `02-academic-route-filter.png`
- `03-academic-index.png`
- `04-change-lens-picker.png`
- `05-neighborhood-open.png`
- `evidence.json`
- `stable-evidence.json`

## User Goal And Accessibility Target

User goal: understand the dossier, choose a reading route, and move through the selected modules without losing context.

Accessibility target: the flow should remain perceivable, keyboard-reachable, and understandable from visible state, labels, and focusable controls. This audit does not claim WCAG compliance because screenshots cannot prove keyboard order, screen-reader output, or reduced-motion behavior end to end.

## Step Notes

### 1. Root full stack

Health: strong visual entry, medium clarity risk.

The root state has a clear material stack and a visible Reading Lens entry point. The main hierarchy works: masthead, lens controls, then module strata. `INDEX (09)` correctly signals the full stack.

Risk: the first captured root state showed split-flap titles as unreadable letter fragments while animation was running. The stable recapture resolved correctly, but a user arriving during the animation can briefly see broken-looking headings across the page.

### 2. Academic lens selected

Health: strong route feedback, medium discoverability risk.

The selected state is much clearer than before: the lens becomes a route stamp, the path is visible as `00 -> 01 -> 04 -> 05 -> 06`, and `INDEX (05)` matches the filtered stack.

Risk: the filter is abrupt. Without a plain "showing Academic route" or "5 of 9 modules" line, `INDEX (05)` can read as missing content instead of an intentional route. The "Change lens" control is small and low-emphasis relative to the impact of filtering the whole stack.

### 3. Academic route Index

Health: visually consistent, medium orientation risk.

The Index view is restrained and readable. Showing only the route modules reduces clutter and aligns with V3.6.9's filtered route model.

Risk: the Index no longer explains that it is filtered. A user who opens Index after selecting Academic sees five modules but no local "Academic route" label, "Clear route", or "All modules" affordance in the overlay itself.

### 4. Change Lens picker

Health: functional, moderate state-density risk.

The picker exposes all lens choices, keeps `ACADEMIC` visibly selected, and includes `Clear`. This solves the dead-end problem of a collapsed route stamp.

Risk: the state switches from route stamp to generic "Select a reading lens" while Academic is still active. That text undercuts the selected button and creates a mild contradiction: the page is already filtered, but the copy sounds unselected.

### 5. Neighborhood open

Health: content reads well, high layout risk.

The opened Neighborhood content is strong: the blue field is flat, the prompt/response hierarchy is legible, and the chart lands as the correct centerpiece.

Bug: the viewport lands with the masthead overlapping the previous `01 TASTE` band/title at the top edge. This is a scroll-offset / re-anchor issue in the selected-route flow. It makes the open state feel like it has not landed cleanly, even though the module content itself is readable.

## Strengths

- The lens is now visible at the root instead of buried inside Front Matter.
- Route metadata is immediate and compact.
- The filtered route stack reduces reading burden for a selected audience.
- The overall visual language is consistent: matte surfaces, hard bands, restrained chrome.
- The Index overlay has clear row hierarchy and a strong close affordance.

## UX Risks

1. Route filtering may surprise users who expected an orientation aid rather than content removal.
2. `INDEX (05)` is technically correct but under-explained.
3. The Index overlay lacks route context after filtering.
4. "Change lens" is too quiet for the control that unlocks the rest of the experience.
5. The module-open landing state can overlap with the masthead and previous module edge.
6. Split-flap animation can create temporarily unreadable headings on first paint or quick captures.

## Accessibility Risks

1. Lens buttons look visually compact; target height may be below comfortable touch size on some devices.
2. Microcopy contrast on cream and blue fields may be marginal for low-vision users, especially chart labels and route helper text.
3. The current audit did not verify focus order, focus visibility, or reduced-motion behavior.
4. Animated headings may be confusing if reduced-motion is not honored consistently or if the text takes too long to settle.
5. The filtered route state needs clear programmatic/visible communication so screen-reader users understand why fewer modules are present.

## Recommendations

1. Add a small route-state line near the lens stamp: `Academic route · 5 of 9 modules shown`.
2. Make `Clear route` or `All modules` visible in the selected lens stamp, not only inside the expanded picker.
3. Add route context inside the Index overlay when filtered: `Academic route` plus `Show all modules`.
4. Fix the module-open re-anchor for filtered routes so the opened module clears the masthead and previous band.
5. Shorten or delay global title split-flap animation on initial root load; reserve the stronger title scramble for module open or intersection after the page settles.
6. Increase lens button vertical padding or minimum height for touch resilience.
7. Run a keyboard pass next: Tab through root, lens picker, Index, and module toggles; verify visible focus and Escape/Close behavior.

## Evidence Limits

- Screenshots were captured in a desktop viewport only.
- Mobile layout, zoom reflow, reduced motion, and screen-reader announcements were not fully tested.
- The audit used visible state and DOM spot checks; it does not prove full accessibility compliance.
