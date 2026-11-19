/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:       '#FF6B00',
          'orange-dark':'#E55F00',
          'orange-light':'#FF8C00',
          blue:         '#1a5276',
          'blue-light': '#2e86c1',
          green:        '#2E7D32',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter',   'sans-serif'],
      },
      /* ── Slow-smooth duration tokens ── */
      transitionDuration: {
        DEFAULT: '550ms',   /* override Tailwind default of 150ms */
        '0':     '0ms',
        '75':    '75ms',
        '100':   '100ms',
        '150':   '150ms',
        '200':   '200ms',
        '300':   '300ms',
        '350':   '350ms',
        '500':   '500ms',
        '550':   '550ms',
        '600':   '600ms',
        '700':   '700ms',
        '750':   '750ms',
        '800':   '800ms',
        '900':   '900ms',
        '1000':  '1000ms',
      },
      /* ── Easing tokens ── */
      transitionTimingFunction: {
        DEFAULT:  'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.15, 0.64, 1)',
        'reveal': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in':     'cubic-bezier(0.4, 0, 1, 1)',
        'out':    'cubic-bezier(0, 0, 0.2, 1)',
      },
      boxShadow: {
        'apple':    '0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'apple-lg': '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'apple-xl': '0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
        'orange':   '0 8px 32px rgba(255,107,0,0.22)',
        'blue':     '0 8px 32px rgba(26,82,118,0.22)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':   'fadeIn 0.7s cubic-bezier(0.4,0,0.2,1)   forwards',
        'spin-slow': 'spin  12s linear infinite',
      },
    },
  },
  plugins: [],
}
