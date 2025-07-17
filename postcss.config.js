// postcss.config.js
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss').Config} */
export default {
  plugins: [
    tailwindcss,   // Tailwind’s PostCSS plugin (v4)
    autoprefixer,  // keeps vendor prefixes
  ],
};