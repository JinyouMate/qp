import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { getAllInsights, getInsight, estimateReadingTime } from "@/lib/insights";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { mdxComponents } from "@/components/site/mdx";

// Cloudflare Pages：只发布预渲染页，未列出的 slug 直接 404，
// 避免生成 Node Runtime 的兜底函数（next-on-pages 不支持）
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllInsights().map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const found = getInsight(params.slug);
  if (!found) return { title: "文章不存在" };

  return buildMetadata({
    title: found.meta.title,
    description: found.meta.description,
    path: `/insights/${found.meta.slug}`,
    keywords: found.meta.tags,
    type: "article",
    publishedTime: found.meta.date,
  });
}

export default function InsightDetailPage({ params }: { params: { slug: string } }) {
  const found = getInsight(params.slug);
  if (!found) notFound();

  const { meta, body } = found;
  const all = getAllInsights();
  const idx = all.findIndex((i) => i.slug === meta.slug);
  const next = idx >= 0 ? all[idx + 1] : undefined;
  const minutes = meta.readingTime ?? estimateReadingTime(meta.words);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: meta.title,
            description: meta.description,
            slug: meta.slug,
            date: meta.date,
            tags: meta.tags,
            author: meta.author,
          }),
          breadcrumbSchema([
            { name: "首页", url: "/" },
            { name: "汽配行业洞察", url: "/insights" },
            { name: meta.title, url: `/insights/${meta.slug}` },
          ]),
        ]}
      />

      <article>
        {/* 文章头 */}
        <header className="border-b bg-brand-cream">
          <div className="container-site max-w-3xl pb-16 pt-10 md:pb-24 md:pt-14">
            <Link
              href="/insights"
              className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> 返回洞察列表
            </Link>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {meta.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl font-bold leading-tight md:text-4xl">{meta.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {meta.description}
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {meta.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 约 {minutes} 分钟
              </span>
              <span>{meta.author ?? "汽配知识局"}</span>
            </div>
          </div>
        </header>

        {/* 正文：MDX */}
        <div className="container-site max-w-3xl pb-16 pt-10 md:pb-24 md:pt-14">
          <div className="mdx-body">
            <MDXRemote source={body} components={mdxComponents} />
          </div>

          {next ? (
            <div className="mt-8">
              <Link
                href={`/insights/${next.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border p-4 transition-shadow hover:shadow-warm-md"
              >
                <div>
                  <div className="text-xs text-muted-foreground">下一篇</div>
                  <div className="mt-1 font-semibold group-hover:text-primary">{next.title}</div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}
