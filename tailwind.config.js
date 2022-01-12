

module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    screens: {
      'xs': '320px',
      // => @media (min-width: 320px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    boxShadow: {
      custom: '0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    outline: {
      none: ['2px solid transparent', '2px'],
      white: ['2px dashed white', '2px'],
      black: ['2px dashed black', '2px'],
    },
    extend: {
      fontFamily: {
        button: ['Barlow', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        'headline':['Oswald', 'sans-serif'],
        'headline-2':['Barlow', 'sans-serif'],
        'subheadline':['Barlow', 'sans-serif'],
        'navigation':['Montserrat', 'sans-serif'],
      },
      colors: {
        pallette: {
          alert:{
            DEFAULT: "#840002",
            hover: "#c80a00"
          },
          grey: {
            light: "#F0F0F0",
            DEFAULT: "#616161",
            dark: "#424242",
            bg: "#0000001A"
          },
          orange: {
            light: '#FBE9D7',
            DEFAULT: '#EB8C2F',
            dark: "#e87300"
          },
          purple: {
            DEFAULT: '#3f3244',
          },
          red: {
            light: "#EC3723",
            DEFAULT: "#C80A00",
            dark: "#9c0800"
          },
          green: {
            DEFAULT: "#0c793d",
          },
          blue: {
            light: "#005E86",
            DEFAULT: "#004458",
            dark: "#004f70"
          },
          gold: {
            DEFAULT: "#F9A51A"
          },
          button:{
            DEFAULT: "#004458",
            hover: "#005e86"
          }
        },
      },
      fontSize:{
        'headline': ['44px', { lineHeight: '1' }],
        'headline-2': ['20px', { lineHeight: '1' }],
        'subheadline': ['20px', { lineHeight: '1' }],
        body: ["14px", { lineHeight: '1' }],
        'navigation':['16px', { lineHeight: '1' }],
      }
    },
  },
}
