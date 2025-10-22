import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: false,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1d4ed8",
          gray: "#f9fafb",
          gold: "#f7b733",
        },
      },
    },
  },
  plugins: [],
};

export default config;
