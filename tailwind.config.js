/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include all files in the app directory
    "./components/**/*.{js,ts,jsx,tsx}", // Include all files in the components directory
  ],
  theme: {
    extend: {}, // Extend the default theme if needed
  },
  plugins: [], // Add any Tailwind plugins if needed
};
