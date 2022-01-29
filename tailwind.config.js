module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "category-img": "115px",
      },
      spacing: {
        "category-img": "20vw",
      },
      fontFamily: { sans: ["Montserrat"] },
      gridTemplateColumns: { listing: "1.5fr 3fr" },
      /* backgroundImage: { user: "url('/img/hero-pattern.svg')", password: "url('/img/hero-pattern.svg')" }, */
    },
  },
  plugins: [],
};
