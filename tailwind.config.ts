import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        piano: {
          black: "#0d0d0f",
          white: "#fafafa",
          ivory: "#e8e4dc",
          active: "#c9a227",
          activeDim: "#a68521",
          border: "#2a2a2e",
          left: "#3b82f6",
          right: "#22c55e",
        },
      },
      boxShadow: {
        piano: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        key: "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
