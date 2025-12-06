/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aion': {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          dark: '#1e1b4b',
        }
      }
    },
  },
  plugins: [],
}
