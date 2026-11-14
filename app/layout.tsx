import type { Metadata, Viewport } from "next";
// 字体改为自托管：next/font/google 在构建期要访问 fonts.gstatic.com，
// CI 构建机访问不到会导致 build 失败。详见 app/fonts.css。
import "./fonts.css";
import "./globals.css";

import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { UtmCapture } from "@/components/site/utm-capture";
import { FloatingCta } from "@/components/site/floating-cta";
import { Analytics } from "@/components/site/analytics";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/site/json-ld";
import { SITE_NAME, SITE_SUB, SITE_SLOGAN, CORE_KEYWORDS, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${SITE_NAME} | ${SITE_SLOGAN}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_SLOGAN}。${SITE_SUB}。知识库建认知、工具库做落地、数据库看利润（312 万 SKU 数据中台账号），另做定制咨询与 AI 数据合作。`,
  keywords: [...CORE_KEYWORDS],
  // favicon 放在 public/（app/favicon.ico 会被 Next 当成动态路由，Cloudflare 边缘构建不支持）
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "zh_CN",
    title: `${SITE_NAME} | ${SITE_SLOGAN}`,
    description: `${SITE_SLOGAN}。${SITE_SUB}。`,
    images: [{ url: absoluteUrl("/og/default.png"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_SLOGAN}`,
    description: `${SITE_SLOGAN}。${SITE_SUB}。`,
    images: [absoluteUrl("/og/default.png")],
  },
};

export const viewport: Viewport = {
  themeColor: "#1F6F4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 全站结构化数据：Organization + WebSite */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Analytics />
        <UtmCapture />
        <Nav />
        {/* 移动端底部固定加微条占位：主内容与页脚之间先留 96px */}
        <main className="pb-24 lg:pb-0">{children}</main>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}
