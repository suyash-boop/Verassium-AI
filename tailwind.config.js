/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // adjust if your files are elsewhere
  ],
  theme: {
    extend: {
      colors: {
        main: "#1D4ED8", // your "main" color
        "main-foreground": "#ffffff",
        background: "#f9fafb",
        "secondary-background": "#f3f4f6",
        foreground: "#111827",
        border: "#d1d5db",
      },
      borderRadius: {
        base: "0.5rem", // for rounded-base
      },
      boxShadow: {
        shadow: "4px 4px 0px black",
      },
      fontFamily: {
        base: ["Work Sans", "sans-serif"],
        heading: ["Michroma", "sans-serif"],
        display: ["Pacifico", "cursive"],
        barlow: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
}