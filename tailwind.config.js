const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    outline: {
      none: ['2px solid transparent', '2px'],
      white: ['2px dashed white', '2px'],
      black: ['2px dashed black', '2px'],
    },
    extend: {
      fontFamily: {
        button: ['DM Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      colors: {
        pallette: {
          grey: {
            light: "#F0F0F0",
            DEFAULT: "#797982",
            dark: "#5c5c63"
          },
          orange: {
            light: '#FBE9D7',
            DEFAULT: '#EB8C2F',
            dark: "#e87300"
          },
        },
    },
    },
  },
}
