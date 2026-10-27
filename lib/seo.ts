import type { Metadata } from "next";

/* ============================================================
   SEO 基础设施
   - 站点常量（品牌名 / 域名 / 默认 OG 图）
   - 核心关键词池（全站 8 个主关键词）
   - buildMetadata()：每个页面生成独立 title / description / OG / canonical
   ============================================================ */

export const SITE_NAME = "汽配知识局";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://qipeizhishi.com"
).replace(/\/$/, "");
export const SITE_SLOGAN = "汽配行业知识资产运营商——把隐性知识变成可交易资产";
export const SITE_SUB = "从数据到决策，从知识到工具";
export const OG_DEFAULT = "/og/default.png";

/** 全站核心关键词（页面按需挑选 3-6 个，避免堆砌） */
export const KEYWORDS = {
  data: "汽配数据",
  oe: "OE号匹配",
  vin: "VIN解析",
  nev: "新能源汽配",
  knowledge: "汽配知识库",
  sop: "汽配SOP",
  compliance: "汽配出海数据合规",
  ai: "汽配AI数据标注",
} as const;

export const CORE_KEYWORDS = Object.values(KEYWORDS);

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageMetaInput {
  /** 不含品牌后缀的标题 */
  title: string;
  description: string;
  /** 以 / 开头的路径，用于 canonical 与 OG url */
  path: string;
  keywords?: string[];
  /** 独立 OG 图，默认 /og/<path>.png，缺省回落到 /og/default.png */
  ogImage?: string;
  /** 内容发布时间（文章类） */
  publishedTime?: string;
  type?: "website" | "article";
  /** 工具/中转页设 true：不进搜索索引，但仍允许跟随链接 */
  noindex?: boolean;
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const ogImage = input.ogImage ?? ogPathFor(input.path);
  const keywords = Array.from(
    new Set(Array.from(input.keywords ?? []).concat(CORE_KEYWORDS))
  );

  return {
    title: input.title,
    description: input.description,
    keywords,
    alternates: { canonical: url },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: SITE_NAME,
      locale: "zh_CN",
      title: `${input.title} | ${SITE_NAME}`,
      description: input.description,
      images: [
        {
          url: absoluteUrl(ogImage),
          width: 1200,
          height: 630,
          alt: `${input.title} | ${SITE_NAME}`,
        },
      ],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} | ${SITE_NAME}`,
      description: input.description,
      images: [absoluteUrl(ogImage)],
    },
  };
}

/** 由路径推导 OG 图文件名：/products → /og/products.png */
export function ogPathFor(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (!clean) return OG_DEFAULT;
  return `/og/${clean.replace(/\//g, "-")}.png`;
}
