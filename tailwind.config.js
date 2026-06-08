/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        revivex: {
          red: '#E11D48', // Crimson Red
          black: '#0F172A',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}
