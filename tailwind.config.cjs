const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        heading: "var(--font-heading)",
        sans: "var(--font-body)",
      },
      textColor: {
        accent: "var(--accent)",
      },
      backgroundColor: {
        accent: "var(--accent)",
      },
      fontSize: {
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring-3)",
        "spring-1": "var(--ease-spring-1)",
        "spring-2": "var(--ease-spring-2)",
        "spring-3": "var(--ease-spring-3)",
        "spring-4": "var(--ease-spring-4)",
        "spring-5": "var(--ease-spring-5)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addUtilities, theme }) =>
      addUtilities({
        ".spring-1": {
          "transition-duration": theme("transitionDuration.200"),
          "transition-timing-function": theme(
            "transitionTimingFunction.spring-1"
          ),
        },
        ".spring-2": {
          "transition-duration": theme("transitionDuration.300"),
          "transition-timing-function": theme(
            "transitionTimingFunction.spring-2"
          ),
        },
        ".spring-3": {
          "transition-duration": theme("transitionDuration.500"),
          "transition-timing-function": theme(
            "transitionTimingFunction.spring-3"
          ),
        },
        ".spring-4": {
          "transition-duration": theme("transitionDuration.500"),
          "transition-timing-function": theme(
            "transitionTimingFunction.spring-4"
          ),
        },
        ".spring-5": {
          "transition-duration": theme("transitionDuration.700"),
          "transition-timing-function": theme(
            "transitionTimingFunction.spring-5"
          ),
        },
      })
    ),
  ],
};
