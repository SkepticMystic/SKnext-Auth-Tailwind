/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/svelte-daisyui-toast/dist/**/*.{js,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
    // TODO: List specific themes here for prod
    themes: true,
  },
};
