/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trana-orange': '#ff6600',
        'trana-dark': '#2c2c2c',
      },
    },
  },
  plugins: [],
}

