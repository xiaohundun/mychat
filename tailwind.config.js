/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transitionDelay: {
        400: "400ms",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
