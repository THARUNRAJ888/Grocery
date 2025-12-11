/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#12b76a",
          600: "#039855",
          700: "#027a48",
        },
      },
      backgroundImage: {
        "grocery-gradient": "linear-gradient(135deg, #12b76a 0%, #32d583 50%, #6ce9a6 100%)",
      },
    },
  },
  plugins: [],
};

