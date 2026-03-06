const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[600],
        secondary: colors.green[500],
        accent: colors.purple[600],
        danger: colors.red[500],
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};