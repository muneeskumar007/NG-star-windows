/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#1F7A63', dark: '#155a48', light: '#2a9970' },
        secondary: { DEFAULT: '#2ECC71', dark: '#27ae60' },
        accent:    { DEFAULT: '#A3E4D7', light: '#d4f5ee' },
        surface:   { DEFAULT: '#F8F9F9', card: '#ffffff' },
        muted:     '#6b7c79',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float':       'float 3s ease-in-out infinite',
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
        'fade-up':     'fadeUp 0.6s ease forwards',
        'slide-in':    'slideIn 0.4s ease forwards',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseDot: { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(1.5)' } },
        fadeUp:   { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn:  { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      boxShadow: {
        'green': '0 8px 32px rgba(31,122,99,0.18)',
        'card':  '0 4px 24px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
}
