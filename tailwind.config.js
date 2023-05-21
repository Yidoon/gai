/** @type {import('tailwindcss').Config} */
console.log(process.env, "process.env");
module.exports = {
  darkMode: [],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },
};
