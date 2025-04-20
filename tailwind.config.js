/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "sidebar-bg": "var(--sidebar-bg)",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".btn": {
          padding: "0.5rem 1.5rem",
          borderRadius: "0.75rem",
          fontWeight: "500",
        },
        ".btn-save": {
            backgroundColor: "#22c55e",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#16a34a",
            },
        },
        ".btn-secondary": {
          "@apply bg-gray-300 text-foreground hover:bg-gray-400": {},
        },
      });
    }),
  ],
};
