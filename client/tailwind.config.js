/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quickgpt-purple': '#8B5CF6',
        'quickgpt-blue': '#3B82F6',
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      }
    },
  },
  plugins: [],
}
