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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "sidebar-bg": "var(--sidebar-bg)",

        success: "var(--success)",
        "success-hover": "var(--success-hover)",
        close: "var(--close)",
        "close-hover": "var(--close-hover)",
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
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 150ms ease",
        },
      });
    }),
  ],
};
