// postcss.config.cjs  ← this one file only
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},   //  ✅ loads Tailwind v4 plug‑in
    autoprefixer: {},             //  ✅ vendor prefixes
  },
};