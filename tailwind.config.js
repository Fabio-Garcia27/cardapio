/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",            // escaneia todos os arquivos HTML na raiz
    "./styles/**/*.css",   // escaneia seus arquivos CSS (opcional, mas seguro)
  ],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}
