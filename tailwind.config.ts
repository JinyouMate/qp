import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* 品牌色：深绿(主) / 砖红(行动) / 暖橙(强调) / 米白 / 浅灰 */
        brand: {
          green: "#1F6F4A",
          "green-mid": "#2F8F5B",
          "green-soft": "#E5F0E9",
          red: "#C44536",
          "red-soft": "#F8E9E5",
          orange: "#E07A3F",
          "orange-soft": "#FBEFE2",
          cream: "#F7F4EF",
          gray: "#E8E5DF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",        /* 16px */
        md: "calc(var(--radius) - 4px)",  /* 12px */
        sm: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sc)",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        warm: "0 4px 16px rgba(122, 98, 62, 0.08)",
        "warm-md": "0 8px 24px rgba(122, 98, 62, 0.11)",
        "warm-lg": "0 12px 32px rgba(122, 98, 62, 0.14)",
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
      },
      animations: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
