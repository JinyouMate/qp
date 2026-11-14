import { SITE_NAME, SITE_URL, SITE_SLOGAN } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import type { Product } from "@/lib/types";

/* ============================================================
   Schema.org 结构化数据
   已接入：Organization / WebSite / Product / Course / FAQPage /
           BreadcrumbList / Article / ItemList
   ============================================================ */

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // 结构化数据由本文件静态生成，不含用户输入
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    /** 工商登记主体，与页脚版权声明一致 */
    legalName: BRAND.legalEntity,
    url: SITE_URL,
    email: BRAND.email,
    slogan: SITE_SLOGAN,
    address: {
      "@type": "PostalAddress",
      addressRegion: BRAND.address,
      addressCountry: "CN",
    },
    description:
      "汽配行业知识资产运营商：知识库、工具库、数据库三层资产。提供避坑指南、行业报告、合规 SOP，选品评分表、核价毛利计算器、库存周转模板，以及 312 万 SKU 数据中台账号（OE 号匹配、万家供货商评级）；另做定制咨询与 AI 数据标注合作。",
    areaServed: { "@type": "Country", name: "CN" },
    knowsAbout: [
      "汽配数据",
      "OE号匹配",
      "VIN解析",
      "新能源汽配",
      "汽配知识库",
      "汽配SOP",
      "汽配出海数据合规",
      "汽配AI数据标注",
    ],
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["zh-CN"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Product schema：价格区间用 AggregateOffer 表达（官网不处理支付） */
export function productSchema(p: Product) {
  const priceMatch = p.price.match(/(\d[\d,]*)/);
  const lowPrice = priceMatch ? priceMatch[1].replace(/,/g, "") : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: `${p.positioning}。${p.problem ? `解决：${p.problem}。` : ""}${p.deliverable ? `交付：${p.deliverable}。` : ""}`,
    category: p.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    audience: { "@type": "BusinessAudience", name: p.audience },
    ...(lowPrice
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "CNY",
            lowPrice,
            availability: "https://schema.org/InStock",
            // 成交在第三方平台完成，官网只做展示与路由
            url: p.third_party_url ?? `${SITE_URL}/products`,
          },
        }
      : {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "CNY",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/contact`,
          },
        }),
  };
}

/** Course schema（结构化数据能力保留，站点当前不输出） */
export function courseSchema(c: {
  name: string;
  description: string;
  audience?: string;
  price?: string;
  url?: string;
}) {
  const priceMatch = c.price?.match(/(\d[\d,]*)/);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.name,
    description: c.description,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    inLanguage: "zh-CN",
    ...(c.audience ? { audience: { "@type": "BusinessAudience", name: c.audience } } : {}),
    ...(priceMatch
      ? {
          offers: {
            "@type": "Offer",
            price: priceMatch[1].replace(/,/g, ""),
            priceCurrency: "CNY",
            url: c.url ?? `${SITE_URL}/courses`,
          },
        }
      : {}),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: a.author ?? SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/insights/${a.slug}` },
    ...(a.tags?.length ? { keywords: a.tags.join(",") } : {}),
  };
}
