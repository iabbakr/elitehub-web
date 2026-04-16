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
        navy: {
          DEFAULT: "#0B2E33",
          mid: "#144D54",
          deep: "#071E22",
          light: "#1A4A52",
        },
        gold: {
          DEFAULT: "#C9A84C",
          muted: "rgba(201,168,76,0.35)",
          faint: "rgba(201,168,76,0.12)",
          light: "#D4B96A",
          dark: "#A8862F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #071E22 0%, #0B2E33 50%, #144D54 100%)",
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #D4B96A 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(11,46,51,0) 0%, rgba(11,46,51,0.85) 100%)",
      },
      boxShadow: {
        gold: "0 4px 24px rgba(201,168,76,0.2)",
        "gold-lg": "0 8px 40px rgba(201,168,76,0.3)",
        navy: "0 4px 24px rgba(11,46,51,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.4)" }, "50%": { boxShadow: "0 0 0 8px rgba(201,168,76,0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
