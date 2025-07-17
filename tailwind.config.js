/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',          // ← keep this
  ],

  safelist: [
    // spacing & gutters
    'px-6', 'sm:px-10', 'lg:px-24',

    // layout helpers used in Footer / buttons
    'flex', 'flex-col', 'items-center', 'justify-center',
    'w-full', 'max-w-sm', 'max-w-2xl',

    // pinned footer offsets
    'bottom-0', 'inset-x-0',
  ],

  theme: { extend: {} },
  plugins: [],
};
