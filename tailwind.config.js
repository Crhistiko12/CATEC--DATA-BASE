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