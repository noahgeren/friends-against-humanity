module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,css}'],
  safelist: [],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['forest']
  }
}
