/** @type {import('tailwindcss').Config} */
const config = {
    // Enable the class-based dark mode
    darkMode: 'class',
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          'sidebar-bg': 'var(--sidebar-bg)',
        },
      },
    },
    plugins: [],
  };

export default config;
  