/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: { extend: {} },
  plugins: [],
  animation: {
        'ping-short': 'ping 0.8s cubic-bezier(0, 0, 0.2, 1) 1'
      }
};
