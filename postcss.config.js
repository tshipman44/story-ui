/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
    // 👇  v4 renamed the plugin, keep this exact key
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};