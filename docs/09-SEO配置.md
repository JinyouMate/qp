# 第 7 步 · SEO 配置、sitemap、robots、Schema

---

## 1. 站点常量 `lib/seo.ts`

```ts
export const SITE_NAME = "汽配知识局";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://qipeizhishi.com";
export const KEYWORDS = { data:"汽配数据", oe:"OE号匹配", vin:"VIN解析", nev:"新能源汽配",
  knowledge:"汽配知识库", sop:"汽配SOP", compliance:"汽配出海数据合规", ai:"汽配AI数据标注" };
```

`buildMetadata({ title, description, path, keywords, ogImage, publishedTime, type })` 自动生成：
`title`（带品牌后缀）、`description`、`keywords`、`canonical`、`openGraph`、`twitter`。

**每页用法**（14 个内页已全部接入）：

```tsx
export const metadata: Metadata = buildMetadata({
  title: "产品中心",
  description: "……",
  path: "/products",
  keywords: ["汽配数据", "汽配SOP"],
});
```

OG 图默认由路径推导：`/products` → `/og/products.png`，`/products/toolkit-selection` → `/og/products-toolkit-selection.png`。

---

## 2. OG 图（40 张，1200×630）

**生成脚本**：`scripts/gen-og.py`（Pillow + 系统 PingFang 字体）

```bash
/Users/qiuganyou/.workbuddy/binaries/python/envs/default/bin/python scripts/gen-og.py
```

| 类别 | 数量 | 命名 |
|---|---|---|
| 页面 | 15 | `og/<page>.png` |
| 文章 | 7 | `og/insights-<slug>.png`（从 MDX frontmatter 读取） |
| **产品详情** | 18 | `og/products-<slug>.png`（从 `lib/data.ts` 解析） |

改品牌名/域名/配色：改脚本顶部 `BRAND` `SLOGAN` `DOMAIN` `GREEN/RED/ORANGE/CREAM` 后重跑。

> **为什么不用 `next/og` 的 ImageResponse**：它不认 woff2，中文字体要走 ttf 且十几 MB，运行时拉字体容易出问题。预生成静态 PNG 更稳。

---

## 3. sitemap.xml `app/sitemap.ts`

共 **40 条**：15 个静态页 + 7 篇文章 + 18 个产品详情，各带 `priority` 与 `changeFrequency`。

```
/            1.0 weekly
/products     0.9 weekly
/knowledge /courses /reports   0.9 monthly
/insights     0.85 weekly
/consulting /partners /content 0.8
/cases /about /contact         0.7
/products/<slug>  0.7 monthly   ← 18 条
/insights/<slug>  0.75 monthly  ← 7 条
/wechat       0.5
/privacy /terms 0.3
```

访问 `/sitemap.xml` 验证。

---

## 4. robots.txt `app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /wechat?*from=*
Sitemap: https://yourdomain.com/sitemap.xml
Host: https://yourdomain.com
```

---

## 5. Schema.org `components/site/json-ld.tsx`

| 类型 | 函数 | 接入页面 |
|---|---|---|
| Organization | `organizationSchema()` | 全站（layout） |
| WebSite + SearchAction | `websiteSchema()` | 全站（layout） |
| **Product** + AggregateOffer | `productSchema(p)` | `/products`、每个 `/products/<slug>` |
| **Course** + Offer | `courseSchema(c)` | `/courses`（3 门课） |
| **FAQPage** | `faqSchema(items)` | `/`（6 问） |
| BreadcrumbList | `breadcrumbSchema(items)` | 所有内页 |
| Article + WebPage | `articleSchema(a)` | `/insights/<slug>` |

用法：

```tsx
<JsonLd data={[productSchema(product), breadcrumbSchema([...])]} />
```

`JsonLd` 内部对 `<` 做 `<` 转义，防 XSS。
价格用 `AggregateOffer`（区间）表达，并在 `url` 指向第三方或产品页——**官网不处理支付**，schema 里也不谎称有 Offer 交易。

---

## 6. MDX 内容 `content/insights/*.mdx`

7 篇长文，正好覆盖 8 个核心关键词：

| slug | 主题 | 关键词 |
|---|---|---|
| `oe-matching` | OE 号匹配 | OE号匹配 |
| `vin-parsing` | VIN 解析 | VIN解析 |
| `nev-aftermarket` | 新能源汽配 | 新能源汽配 |
| `overseas-data-compliance` | 出海数据合规 | 汽配出海数据合规 |
| `ai-data-annotation` | AI 数据标注 | 汽配AI数据标注 |
| `selection-sop` | 选品 SOP | 汽配SOP |
| `knowledge-base-building` | 知识库建设 | 汽配知识库 |

- `next-mdx-remote@5` + `gray-matter`，`generateStaticParams` 全部静态生成
- 每篇独立 `title` / `description` / OG / `article:published_time`
- 正文排版在 `app/globals.css` 的 `.mdx-body`
- **新增文章**：在 `content/insights/` 加 `.mdx`（frontmatter: title/description/date/tags），重跑 `gen-og.py`，构建后自动进列表与 sitemap

frontmatter 示例：

```yaml
---
title: "OE 号匹配：为什么你的适配数据总在出错"
description: "……"
date: "2026-10-16"
tags: ["OE号匹配", "汽配数据"]
---
```

---

## 7. 上线前 SEO 必改

1. **`NEXT_PUBLIC_SITE_URL` 改成真实域名**——canonical、sitemap、OG 绝对地址全靠它，现在还是占位 `qipeizhishi.com`
2. 补 `organizationSchema()` 里的 `sameAs`（抖音/视频号/知乎/公众号主页 URL），有助于品牌实体识别
3. Google Search Console 提交 sitemap；Bing/百度站长平台同样提交
4. 用 [Google 富媒体测试工具](https://search.google.com/test/rich-results) 验证 Product / Course / FAQPage / Article 无报错
5. 每篇 MDX 的 `date` 保持真实，不要写成未来时间
