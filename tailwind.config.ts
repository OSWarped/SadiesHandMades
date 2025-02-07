/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}", 
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5E35B1", // Deep Indigo
        secondary: "#00ACC1", // Teal Blue
        highlight: "#66BB6A", // Mint Green
        background: "#E8EAF6", // Soft Periwinkle
        textDark: "#222831",
      },
    },
  },
  plugins: [],
};
