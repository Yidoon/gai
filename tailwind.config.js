/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: [],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },
};
