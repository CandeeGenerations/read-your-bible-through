/* eslint @typescript-eslint/no-var-requires: 0 */
const colors = require('tailwindcss/colors')
const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')

module.exports = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        body: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Ubuntu, Roboto, Noto, "Segoe UI", Arial, sans-serif',
        serif: "'Merriweather', Georgia, serif",
      },
      colors: {
        primary: {
          50: '#c8bcf1',
          100: '#beb2e7',
          200: '#b4a8dd',
          300: '#aa9ed3',
          400: '#a094c9',
          500: '#968abf',
          600: '#8c80b5',
          700: '#8276ab',
          800: '#786ca1',
          900: '#6e6297',
        },
        secondary: colors.slate,
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
}
