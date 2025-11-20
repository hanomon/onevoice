/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'doctor-blue': '#2c3e50',
        'doctor-gray': '#34495e',
      }
    },
  },
  plugins: [],
}

