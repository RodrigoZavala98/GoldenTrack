/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Aquí añadimos DaisyUI como un plugin
  plugins: [import('daisyui')],

  // Opcional pero recomendado: Configura los temas que quieres usar
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "retro",
      "cyberpunk",
      "valentine",
      "aqua",
      "dracula", // Añadido para que coincida con tu dropdown
      "nord"     // Añadido para que coincida con tu dropdown
    ],
  },
}