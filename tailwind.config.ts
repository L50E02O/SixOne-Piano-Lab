import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        piano: {
          black: "#1a1a1a",
          white: "#f5f5f5",
          active: "#6366f1",
          border: "#2d2d2d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
