import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff8f8",
          100: "#fdeeee",
          200: "#f9d5d8",
          300: "#f2bbc0",
          400: "#de9aa2"
        },
        nude: {
          50: "#fdfaf6",
          100: "#f6efe6",
          200: "#e8d6c2",
          300: "#d8bea4",
          400: "#c9aa8f"
        },
        gold: {
          100: "#f9efd7",
          200: "#edd5a9",
          300: "#dbbc77",
          400: "#c79f45"
        },
        ink: "#3b3140",
        muted: "#6f6373"
      },
      boxShadow: {
        soft: "0 10px 30px -14px rgba(107, 84, 95, 0.35)",
        card: "0 8px 18px -12px rgba(46, 35, 52, 0.25)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(255, 221, 224, 0.65), transparent 42%), radial-gradient(circle at 80% 0%, rgba(233, 210, 177, 0.48), transparent 35%), linear-gradient(135deg, #fff8f8 0%, #fcf4ee 45%, #f8ece5 100%)"
      }
    }
  },
  plugins: []
};

export default config;
