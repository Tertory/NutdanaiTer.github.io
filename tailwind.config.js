/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily:{
        "kanit":['Kanit','sans-serif']
      }
    },
  },
  plugins: [require('tailwind-hamburgers')],
}

