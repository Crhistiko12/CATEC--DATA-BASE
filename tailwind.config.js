/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "2rem",
        xl: "2rem",
      },
    },
    extend: {
      keyframes: {
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'fade-out-right': {
          '0%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
        },
      },
      animation: {
        'fade-in-right': 'fade-in-right 0.3s ease-out forwards',
        'fade-out-right': 'fade-out-right 0.3s ease-in forwards',
      },
      colors: {
        yellow: {
          400: "#FBB03B"
        },
        blue: {
          100: "#E0F7FA",
          50: "#F0FCFF"
        }
      },
      fontFamily: {
        sans: ["'Lato'", "sans-serif"],
        headings: ["'Fredoka'", "sans-serif"] 
      }
    }
  },
  plugins: []
};