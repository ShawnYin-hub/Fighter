/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'gallery-white': '#F9F9F9',
        'duelist-black': '#000000',
        'duelist-input-bg': '#F1F1F1',
        'duelist-gallery': '#F9F9F9',
        'duelist-charcoal': '#0A0A0B',
        'duelist-gold': '#D4AF37',
        'duelist-gold-light': '#F1E5AC',
        'light-gold': '#D4C5A3',
        'soft-gold-glow': 'rgba(212, 197, 163, 0.4)',
        'ios-gray': '#8E8E93',
        'off-white': '#F2F2F7',
        'deep-charcoal': '#1C1C1E',
        'pure-white': '#FFFFFF',
        'win-gold': '#C5A059',
        primary: "#D4C5A3",
        "dark-charcoal": "#0F0F0F",
        "void-black": "#0A0A0A",
        "card-bg": "#1A1917",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "San Francisco", "Helvetica Neue", "Inter", "sans-serif"],
        serif: ["Noto Serif SC", "serif"],
      },
      boxShadow: {
        'ios': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.2)',
        'card-left': '0 20px 40px rgba(0, 0, 0, 0.2)',
        'card-right': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(212, 197, 163, 0.2)',
        'gold-pulse': '0 0 40px 4px rgba(212, 197, 163, 0.15)',
      }
    },
  },
  plugins: [],
}
