import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";
import { getAllInsights } from "@/lib/insights";
import { FALLBACK_PRODUCTS } from "@/lib/data";

export const dynamic = "force-static";

/** 静态页面：path / 更新频率 / 相对权重 */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/knowledge", priority: 0.9, changeFrequency: "monthly" },
  { path: "/courses", priority: 0.9, changeFrequency: "monthly" },
  { path: "/reports", priority: 0.9, changeFrequency: "monthly" },
  { path: "/consulting", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.8, changeFrequency: "monthly" },
  { path: "/content", priority: 0.8, changeFrequency: "weekly" },
  { path: "/insights", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cases", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/wechat", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const insightEntries: MetadataRoute.Sitemap = getAllInsights().map((i) => ({
    url: `${SITE_URL}/insights/${i.slug}`,
    lastModified: new Date(i.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const productEntries: MetadataRoute.Sitemap = FALLBACK_PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...insightEntries, ...productEntries];
}
