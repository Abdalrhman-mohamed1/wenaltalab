import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        surface: "#111111",
        gold: {
          DEFAULT: "#D4AF37",
          glow: "#FFD700",
        },
        muted: "#CFCFCF",
        border: "#2A2A2A",
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
