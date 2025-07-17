// postcss.config.cjs   ← make sure this is the ONLY PostCSS config
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // object key, NOT an array element
    autoprefixer: {},
  },
};