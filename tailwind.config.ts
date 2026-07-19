import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Palette derived from the Galmudug state flag: UN blue #4189dd,
      // white, and star green #009a49. Token names are kept from the
      // original landscape palette so components need no changes.
      // The exact flag hues sit at 500/600; text/dark-surface shades are
      // deeper cuts of the same hue to preserve WCAG AA contrast.
      colors: {
        ocean: {
          50: "#f0f6fd",
          100: "#ddebfa",
          200: "#c2dcf6",
          300: "#97c2ee",
          400: "#66a4e5",
          500: "#4189dd", // flag blue
          600: "#2b6fc6",
          700: "#245ba3",
          800: "#214c85",
          900: "#1e3e6b",
          950: "#14294a",
        },
        // Former warm sand → cool cloud neutrals (the flag's white).
        sand: {
          50: "#fbfcfe",
          100: "#f4f7fb",
          200: "#e5ebf3",
          300: "#cfd9e7",
          400: "#aebdd2",
          500: "#8fa2bc",
          600: "#71839d",
          700: "#5a6a82",
          800: "#48556a",
          900: "#3b4657",
        },
        acacia: {
          50: "#eefaf3",
          100: "#d6f3e2",
          200: "#b0e5c9",
          300: "#7dd1a9",
          400: "#45b681",
          500: "#12a75d",
          600: "#009a49", // flag star green
          700: "#007c3b",
          800: "#036231",
          900: "#07512a",
        },
        // Accent (labels, read-more links): the flag green, dark enough for text.
        clay: {
          400: "#23b06b",
          500: "#009a49",
          600: "#007c3b",
          700: "#00602e",
        },
        ink: "#17243b",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Noto Sans",
          "sans-serif",
        ],
        display: [
          "Georgia",
          "Times New Roman",
          "Noto Serif",
          "serif",
        ],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
