/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          hover: '#1557b0',
        },
        border: '#dadce0',
        text: '#3c4043',
        'background-hover': '#f6f9fe',
        disabled: '#5f6368',
        surface: '#ffffff',
      },
    },
  },
  plugins: [],
} 