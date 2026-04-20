import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        twinkle: 'starTwinkle 4s ease-in-out infinite',
      },
      colors: {
        background: "#020617",
        primary: {
          DEFAULT: "#06b6d4",
          dark: "#0891b2",
          light: "#22d3ee",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
          light: "#a78bfa",
        },
        accent: "#f472b6",
        success: "#10b981",
        danger: "#ef4444",
        card: "rgba(15, 23, 42, 0.6)",
        border: "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        'stellar-gradient': 'linear-gradient(to right, #06b6d4, #8b5cf6)',
        'cosmic-mesh': 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(2, 6, 23, 0) 50%)',
      },
    },
  },
  plugins: [],
};
export default config;
