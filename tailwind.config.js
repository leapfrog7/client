/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customPink: "#BE185D",
        customBlue: "#16075a",
        customEmerald: "#047857",
        customFuchsia: "#86198F",
        customYellow: "#EAB308",
        customViolet: "#5B21B6",
        customGrey: "#1F2937",
        customPurple: "#581C87",
        customCyan: "#155E75",
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
          // Add other shades as needed
        },
      },
      fontFamily: {
        custom: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        text: "1px 1px 2px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  variants: {
    extend: {
      ringColor: ["focus"],
      borderColor: ["focus"],
    },
  },
  plugins: [],
};
