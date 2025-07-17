// postcss.config.cjs   ← make sure this is the ONLY PostCSS config
const tailwindcss  = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

/** @type {import('postcss').Config} */
module.exports = {
  plugins: [tailwindcss, autoprefixer],   // ← array of plugin FUNCTIONS
};
