import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

// Dezemu brand color
const PRIMARY_COLOR = "#ff6a00";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(20, 14.3%, 4.1%)",
        card: "hsl(0, 0%, 100%)",
        cardForeground: "hsl(20, 14.3%, 4.1%)",
        popover: "hsl(0, 0%, 100%)",
        popoverForeground: "hsl(20, 14.3%, 4.1%)",
        // Dezemu primary brand color
        primary: {
          DEFAULT: PRIMARY_COLOR,
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: PRIMARY_COLOR,
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        primaryForeground: "#ffffff",
        secondary: "hsl(33, 100%, 96%)",
        secondaryForeground: "hsl(25, 90%, 20%)",
        muted: "hsl(60, 4.8%, 95.9%)",
        mutedForeground: "hsl(25, 5.3%, 44.7%)",
        accent: "hsl(33, 100%, 96%)",
        accentForeground: "hsl(25, 90%, 20%)",
        destructive: "hsl(0, 84.2%, 60.2%)",
        destructiveForeground: "hsl(60, 9.1%, 97.8%)",
        border: "hsl(20, 5.9%, 90%)",
        input: "hsl(20, 5.9%, 90%)",
        ring: PRIMARY_COLOR,
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      }
    }
  },
  plugins: [
    typography,
    animate
  ]
};

export default config;
