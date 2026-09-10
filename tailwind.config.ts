import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#D9B9B0",
        ink: "#242126",
        muted: "#6F6870",
        accent: "#7B3046",
        "soft-accent": "#E8D7D9",
        "dark-canvas": "#161417"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: { line: "0 0 0 1px rgba(36, 33, 38, 0.1)" }
    }
  },
  plugins: []
};

export default config;
