/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',  // Tell Tailwind to scan these files for class names
    ],
    theme: {
      extend: {
        gridTemplateColumns: {
            25: 'repeat(25, minmax(0, 1fr))',
          },
          gridTemplateRows: {
            25: 'repeat(25, minmax(0, 1fr))',
          },
        // You can add customizations here (e.g. fonts, colors, spacing)
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }