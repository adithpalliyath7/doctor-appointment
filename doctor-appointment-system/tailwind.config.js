/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#49B3A3',
          light: '#5fc4b5',
          dark: '#3a8f82',
        },
        secondary: '#f0fdfa', // Teal 50
        accent: '#f59e0b',    // Amber 500
      }
    },
  },
  plugins: [],
}
