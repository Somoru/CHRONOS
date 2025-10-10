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
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00ffff",
          pink: "#ff00ff",
          green: "#00ff00",
          yellow: "#ffff00",
          blue: "#0088ff",
          magenta: "#ff00ff",
          purple: "#8b00ff",
        },
        dark: {
          bg: "#0a0610",
          surface: "#1a0f2e",
          border: "#333333",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          bg: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
        cyber: ["Orbitron", "monospace"],
        sans: ["Roboto Mono", "monospace"],
      },
      animation: {
        "pulse-neon": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        typewriter: "typewriter 2s steps(40) 1s both",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        flicker: "flicker 2s infinite alternate",
        dots: "dots 1.5s infinite",
        typing: "typing 3.5s steps(40, end)",
        "blink-caret": "blink-caret 0.75s step-end infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite alternate",
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          from: {
            textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
          },
          to: {
            textShadow: "0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff",
          },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": {
            opacity: "1",
            textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff",
          },
          "20%, 24%, 55%": {
            opacity: "0.8",
            textShadow: "none",
          },
        },
        dots: {
          "0%, 20%": { content: "''" },
          "40%": { content: "'.'" },
          "60%": { content: "'..'" },
          "80%, 100%": { content: "'...'" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00ffff" },
        },
        "pulse-border": {
          from: {
            boxShadow: "0 0 10px #00ffff, inset 0 0 10px rgba(0, 255, 255, 0.1)",
          },
          to: {
            boxShadow: "0 0 20px #00ffff, 0 0 30px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.2)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;