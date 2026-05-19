/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "360px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1620px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      backgroundColor: {
        'custom-green': 'rgba(0, 191, 99, 0.5)',
      },
      colors: {
        primary: "#00BF63",
        secondary: "#E6F9EF",
        textGray: "#494949",
      },
    },
  },
  plugins: [],
};
