const {createGlobPatternsForDependencies} = require('@nrwl/react/tailwind');
const {join} = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        join(
            __dirname,
            '{src,app,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
        ),
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        extend: {
            colors: {
                feeney_primary: '#00A5CE',
                feeney_primary_dark: '#038DAF',
                feeney_primary_light: '#cdedf5',
                feeney_secondary: '#595959',
                feeney_secondary_dark: '#2D2D2D',
                feeney_highlight: '#B5B5B5',
                feeney_disabled: '#747474',
                feeney_disabled_light: '#8d8c8c',
            },
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
