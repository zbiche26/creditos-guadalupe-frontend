/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        guadalupe: {
          amarillo: '#FFCC00',
          azul: '#152D57',
          gris: '#8E8E93',
          blanco: '#FFFFFF',
        }
      },
      fontFamily: {
        // Establece Roboto como la fuente principal sin serifas
        sans: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}