/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',   // ← matches every file in src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};