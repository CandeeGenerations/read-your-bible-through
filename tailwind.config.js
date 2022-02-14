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
        primary: colors.indigo,
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
}
