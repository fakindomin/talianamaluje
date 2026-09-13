import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas-rgb, 217 185 176) / <alpha-value>)",
        ink: "#242126",
        muted: "#6F6870",
        accent: "rgb(var(--color-accent-rgb, 123 48 70) / <alpha-value>)",
        "soft-accent": "rgb(var(--color-soft-accent-rgb, 232 215 217) / <alpha-value>)",
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
