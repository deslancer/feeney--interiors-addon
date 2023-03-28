const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
        __dirname,
        '{src,app,components}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'feeney_primary': "#00A5CE",
        'feeney_primary_dark': "#038DAF",
        'feeney_secondary': "#595959",
        'feeney_secondary_dark': "#2D2D2D",
        'feeney_highlight': "#B5B5B5",
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
