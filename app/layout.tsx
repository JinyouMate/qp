import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { UtmCapture } from "@/components/site/utm-capture";
import { AiChat } from "@/components/site/ai-chat";
import { FloatingCta } from "@/components/site/floating-cta";
import { Analytics } from "@/components/site/analytics";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/site/json-ld";
import { SITE_NAME, SITE_SUB, SITE_SLOGAN, CORE_KEYWORDS, absoluteUrl } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${SITE_NAME} | ${SITE_SLOGAN}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_SLOGAN}。${SITE_SUB}。知识库、SOP、行业报告、培训课程、数据产品、咨询内训、AI 数据合作。`,
  keywords: [...CORE_KEYWORDS],
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
    <html lang="zh-CN" className={`${inter.variable} ${notoSc.variable}`}>
      <head>
        {/* 全站结构化数据：Organization + WebSite */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Analytics />
        <UtmCapture />
        <Nav />
        {/* 移动端底部固定留资条占位 */}
        <main className="pb-16 lg:pb-0">{children}</main>
        <Footer />
        <FloatingCta />
        <AiChat />
      </body>
    </html>
  );
}
