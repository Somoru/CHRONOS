import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0610",
        foreground: "#e0e0e0",
        neon: {
          cyan: "#00ffff",
          magenta: "#ff00ff",
        },
        dark: {
          bg: "#0a0610",
          surface: "#1a0f2e",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          bg: "rgba(26, 15, 46, 0.5)",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
        sans: ["var(--font-geist-sans)", "sans-serif"],
        cyber: ["Orbitron", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out forwards",
        flicker: "flicker 3s infinite alternate",
        "pulse-border": "pulse-border 2s ease-in-out infinite alternate",
        "matrix-rain": "matrix-rain 1s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": {
            opacity: "1",
            textShadow:
              "0 0 5px var(--neon-magenta), 0 0 10px var(--neon-magenta), 0 0 15px var(--neon-magenta)",
          },
          "20%, 24%, 55%": {
            opacity: "0.8",
            textShadow: "none",
          },
        },
        "pulse-border": {
          from: {
            boxShadow:
              "0 0 10px var(--neon-cyan), inset 0 0 10px rgba(0, 255, 255, 0.1)",
          },
          to: {
            boxShadow:
              "0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan), inset 0 0 20px rgba(0, 255, 255, 0.2)",
          },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
