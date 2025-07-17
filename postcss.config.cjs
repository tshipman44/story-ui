// postcss.config.cjs   ← note the .cjs extension
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};