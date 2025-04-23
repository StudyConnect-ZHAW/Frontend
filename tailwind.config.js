/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Basic colors CSS‑variables */
        background: "var(--background)",
        foreground: "var(--foreground)",
        "sidebar-bg": "var(--sidebar-bg)",

        /* Buttons & Status */
        success: "var(--success)",
        "success-hover": "var(--success-hover)",
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        /* Layout for all buttons */
        ".btn": {
          padding: "0.5rem 1.5rem",
          borderRadius: "0.75rem",
          fontWeight: "500",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 150ms ease",
        },
        /* primary action button */
        ".btn-save": {
          backgroundColor: theme("colors.success"),
          color: theme("colors.white"),
          "&:hover": {
            backgroundColor: theme("colors.success-hover"),
          },
        },
        /* Secondary button */
        ".btn-secondary": {
          backgroundColor: theme("colors.secondary"),
          color: theme("colors.foreground"),
          "&:hover": {
            backgroundColor: theme("colors.secondary-hover"),
          },
        },
      });
    }),
  ],
};
