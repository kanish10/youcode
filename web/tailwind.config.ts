import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#52695e", dim: "#465d52", container: "#cee9da", "on-container": "#40574c" },
        secondary: { DEFAULT: "#6d6258", dim: "#61564c", container: "#efe0d2", "on-container": "#5a5046" },
        tertiary: { DEFAULT: "#6b6077", dim: "#5e546b", container: "#eee0fc", "on-container": "#594f66" },
        surface: { DEFAULT: "#fffcf7", dim: "#e4e3da", variant: "#eae8e0", container: "#f6f3ec", high: "#f0eee6" },
        "on-surface": { DEFAULT: "#383833", variant: "#65655e" },
        outline: { DEFAULT: "#81817a", variant: "#bbb9b2" },
        error: { DEFAULT: "#af3d3b" },
      },
      fontFamily: {
        headline: ["'Noto Serif'", "Georgia", "serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.75rem" },
    },
  },
  plugins: [],
};
export default config;
