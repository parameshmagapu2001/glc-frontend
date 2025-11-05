import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006F3C", // Greenland Capital green
        secondary: "#A7C957",
      },
    },
  },
  plugins: [],
};
export default config;
