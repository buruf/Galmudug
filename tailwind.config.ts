import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef7fb",
          100: "#d6ecf5",
          200: "#aed9ec",
          300: "#7cc0dd",
          400: "#429fc7",
          500: "#1273a6",
          600: "#0e5f8b",
          700: "#0e4c71",
          800: "#0b3d5c",
          900: "#092f47",
          950: "#061e2e",
        },
        sand: {
          50: "#fbf8f1",
          100: "#f5efe2",
          200: "#e9dcc3",
          300: "#dbc69d",
          400: "#c9a96e",
          500: "#b98f4c",
          600: "#a17540",
          700: "#845c37",
          800: "#6d4b32",
          900: "#5a3f2c",
        },
        acacia: {
          50: "#f0f7f3",
          100: "#dbece1",
          200: "#b9d9c7",
          300: "#8dbfa5",
          400: "#5e9f80",
          500: "#3f8264",
          600: "#2f6b4f",
          700: "#265540",
          800: "#204434",
          900: "#1b382c",
        },
        clay: {
          400: "#d97f4a",
          500: "#c4622d",
          600: "#a84e21",
          700: "#8a3d1b",
        },
        ink: "#1b2733",
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
