module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00a9e2",
        "primary-dark": "#0098cb",
      },
      transitionProperty: {
        width: "width",
        height: "height",
      },
    },
  },
  plugins: [],
};
