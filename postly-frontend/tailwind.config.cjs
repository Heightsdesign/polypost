/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: "#6C63FF",
        yellow: "#FFCE33",
        teal: "#00C2A8",
        pink: "#FF6DAA",
        offwhite: "#FBF8F6",
        dark: "#2D2D4A",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
