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
        /* ==========================================================
           扶木生火 · 色彩系统 V3
           木 = 品牌绿（Logo / 结构 / 辅助标签，知识的支撑）
           火 = 阳光橙（主 CTA / 关键数字，行动与生发）
           金/水 = 米白暖灰（背景与边框，克制不抢戏）
           严禁大面积深黑 / 深蓝 / 极深墨绿
           ========================================================== */
        brand: {
          /* 木：品牌绿，保留给 Logo、标题、标签、结构 */
          green: "#1F6F4A",
          "green-mid": "#2F8F5B",
          "green-soft": "#EAF3ED",
          /* 火：阳光橙（= orange-600），全站唯一行动色 */
          orange: "#EA580C",
          "orange-dark": "#C2410C",   /* hover = orange-700 */
          "orange-ink": "#B45309",    /* 浅底上的小字橙，保证可读 */
          "orange-soft": "#FFF2E7",
          /* 少量结果数字用的朱砂红（非行动色） */
          red: "#C44536",
          "red-soft": "#F8E9E5",
          /* 金/水：暖白与浅暖灰 */
          cream: "#F8F6F1",
          gray: "#EDE9E2",
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
        /* 火：阳光橙弥散阴影，用于悬浮数据卡与卡片 hover */
        "sun": "0 10px 28px -12px rgba(234, 88, 12, 0.22), 0 3px 10px -6px rgba(234, 88, 12, 0.10)",
        "sun-lg": "0 18px 40px -18px rgba(234, 88, 12, 0.28), 0 4px 12px -6px rgba(234, 88, 12, 0.10)",
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
