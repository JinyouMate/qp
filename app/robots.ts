import type { MetadataRoute } from "next";

/**
 * 全站允许所有爬虫抓取（不设置任何 Disallow）。
 * Sitemap 必须是可直达的绝对路径，百度 / Google 才会按此地址读取。
 */
const SITEMAP_URL = "https://jinyoudata.com/sitemap.xml";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: SITEMAP_URL,
  };
}
