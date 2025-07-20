/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1A1200",          // dark warm background (tab bar background)
        secondary: "#4E2A00",        // darker warm tone, for secondary backgrounds
        light: {
          100: "#FFD8B1",            // light warm cream
          200: "#FFBC80",            // light warm orange
          300: "#E59853",            // medium warm orange
        },
        dark: {
          100: "#7A4F01",            // dark burnt orange
          200: "#4E2A00",            // very dark brown-orange
        },
        accent: "#FFA500",            // bright classic orange (used for icon tint, border, accents)
        brightOrange: "#FF8000",     // bright orange (used for focused tab background)
      },
    },
  },
  plugins: [],
};
