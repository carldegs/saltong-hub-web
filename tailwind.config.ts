import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "saltong-green": {
          "50": "#f0f9f3",
          "100": "#daf1e1",
          "200": "#b7e3c8",
          "300": "#88cda6",
          "400": "#56b181",
          DEFAULT: "#2f855a",
          "500": "#2f855a",
          "600": "#24774f",
          "700": "#1d5f41",
          "800": "#194c35",
          "900": "#163e2d",
          "950": "#0b2319",
        },
        "saltong-red": {
          "50": "#fdf3f3",
          "100": "#fce4e4",
          "200": "#facece",
          "300": "#f5acac",
          "400": "#ed7c7c",
          "500": "#e15252",
          DEFAULT: "#c53030",
          "600": "#c53030",
          "700": "#ad2828",
          "800": "#8f2525",
          "900": "#772525",
          "950": "#400f0f",
        },
        "saltong-blue": {
          "50": "#f3f6fc",
          "100": "#e6eef8",
          "200": "#c7dbf0",
          "300": "#95bce4",
          "400": "#5d9bd3",
          "500": "#387ebf",
          DEFAULT: "#2b6cb0",
          "600": "#2b6cb0",
          "700": "#214f83",
          "800": "#1f456d",
          "900": "#1f3b5b",
          "950": "#14263d",
        },
        "saltong-purple": {
          "50": "#f5f5fd",
          "100": "#eeecfb",
          "200": "#dfdcf8",
          "300": "#c5bff3",
          "400": "#a89bea",
          "500": "#8a72e0",
          "600": "#7854d3",
          DEFAULT: "#6b46c1",
          "700": "#6b46c1",
          "800": "#5636a1",
          "900": "#482e84",
          "950": "#2d1c59",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-7deg)",
          },
          "50%": {
            transform: "rotate(7deg)",
          },
        },
        wobble: {
          // @keyframes wobble-hor-bottom{0%,100%{transform:translateX(0);transform-origin:50% 50%}15%{transform:translateX(-30px) rotate(-6deg)}30%{transform:translateX(15px) rotate(6deg)}45%{transform:translateX(-15px) rotate(-3.6deg)}60%{transform:translateX(9px) rotate(2.4deg)}75%{transform:translateX(-6px) rotate(-1.2deg)}}
          "0%, 100%": {
            transform: "translateX(0)",
            transformOrigin: "50% 50%",
          },
          "15%": {
            transform: "translateX(-30px) rotate(-6deg)",
          },
          "30%": {
            transform: "translateX(15px) rotate(6deg)",
          },
          "45%": {
            transform: "translateX(-15px) rotate(-3.6deg)",
          },
          "60%": {
            transform: "translateX(9px) rotate(2.4deg)",
          },
          "75%": {
            transform: "translateX(-6px) rotate(-1.2deg)",
          },
        },
        "slide-out": {
          "0%": {
            transform: "translateY(0) scale(1.2)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-50px) scale(1.3)",
            opacity: "0.5",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.15s ease-in-out infinite",
        wobble: "wobble 0.6s both",
        "slide-out": "slide-out 0.5s cubic-bezier(.55,.085,.68,.53) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-easing")],
} satisfies Config;

export default config;
