/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{ts,tsx,jsx}',
    './components/**/*.{ts,tsx,jsx}',
    './hooks/**/*.{ts,tsx,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // BRONC palette reskin (experiment/bronc-palette). Token NAMES retained
        // to avoid churn — the values are now olive/putty/near-black/dark-olive:
        'strata-blue': '#6E7248',   // "blue" is now matte OLIVE (BIOGRAPHY band, selection, index accent)
        'strata-cream': '#F2EFE4',  // light cream paper (reverted — putty read too dark) (FRONT MATTER, INFLUENCES, body)
        'strata-black': '#0A0A0A',  // near-black (AI, BRAND)
        'strata-clay': '#464A2C',   // "clay" is now DARK OLIVE-DRAB (AMERICAN DYNAMISM) — the 2nd green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tight: '-0.025em',
        wide: '0.025em',
        wider: '0.05em',
        ultra: '0.15em',
      },
      fontSize: {
        micro: ['10px', { lineHeight: '1.4' }],
        label: ['12px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        caption: ['14px', { lineHeight: '1.5' }],
        body: ['16px', { lineHeight: '1.6' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        lead: ['20px', { lineHeight: '1.5' }],
        subhead: ['24px', { lineHeight: '1.4' }],
        heading: ['32px', { lineHeight: '1.3' }],
        display: ['40px', { lineHeight: '1.2' }],
        hero: ['54px', { lineHeight: '1.04' }],
      },
      opacity: {
        primary: '1',
        secondary: '.9',
        tertiary: '.7',
        muted: '.6',
        subtle: '.5',
        faint: '.3',
        ghost: '.1',
      },
    },
  },
  plugins: [],
};
