module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        xxl: "200px",
        xxxl: "300px",
        xxxxl: "400px",
        "xxxxl-5": "450px",
        xxxxxl: "500px",
        xxxxxxl: "550px",
      },
    },
    screens: {
      "md-laptop": { max: "1440px" },
      // => @media (max-width: 1280px) { ... }

      "sm-laptop": { max: "1280px" },
      // => @media (max-width: 1280px) { ... }

      "lg-tab": { max: "1024px" },
      // => @media (max-width: 1024px) { ... }

      tab: { max: "768px" },
      // => @media (max-width: 768px) { ... }

      "sm-tab": { max: "540px" },
      // => @media (max-width: 540px) { ... }

      phone: { max: "500px" },
      // => @media (max-width: 500px) { ... }

      "sm-phone": { max: "380px" },
      // => @media (max-width: 380px) { ... }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
