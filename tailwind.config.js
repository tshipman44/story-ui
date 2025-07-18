/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{js,jsx,ts,tsx}',   // ← scan everything everywhere
  ],

  safelist: [
  'px-6', 'sm:px-10', 'lg:px-24',   // gutters
  'bottom-0', 'inset-x-0',          // pinned footer
  'flex', 'flex-col', 'items-center', 'justify-center',
  'w-full', 'max-w-sm', 'max-w-2xl', // layout wrappers
],

  theme: { extend: {} },
  plugins: [],
};
