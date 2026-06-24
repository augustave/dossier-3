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
        'strata-blue': '#5E7CFF',
        'strata-cream': '#F2EFE4',
        'strata-black': '#050505',
        'strata-clay': '#8F6F50',
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
