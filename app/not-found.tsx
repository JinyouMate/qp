import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { WecomCtaButton } from "@/components/site/wecom-dialog";
import { Badge } from "@/components/ui/badge";

/* 全局 404：不走 PageHero，避免出现两个 h1；保留极简品牌感 + 4 条常用去处。
   Next.js App Router 里 not-found.tsx 只在 404 时渲染，静态导出时也是纯静态页。 */

export const metadata: Metadata = {
  title: "页面不存在 · 404",
  description: "这个地址没有内容。回到首页，或从服务目录、数据洞察里重新找你要的资料。",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "首页", desc: "从数据洞察开始" },
  { href: "/products", label: "服务目录", desc: "知识库 / 工具库 / 数据库" },
  { href: "/content", label: "数据洞察", desc: "看真实大盘与方法" },
  { href: "/about", label: "关于我们", desc: "我们做什么、不做什么" },
];

export default function NotFound() {
  return (
    <section className="section-pad bg-brand-cream">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="accent">404 · PAGE NOT FOUND</Badge>
          <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
            这个地址没有内容
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            可能是链接改过、或者地址输错了一个字母。下面四个入口覆盖了站内全部内容，
            也可以直接找主理人要。
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-3 rounded-xl border bg-white px-5 py-4 transition-shadow hover:shadow-warm-md"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">{l.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{l.desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-green transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 border-t pt-8 text-center sm:flex-row sm:justify-center">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Compass className="h-4 w-4 text-brand-green" strokeWidth={1.75} />
            找不到想要的资料？
          </span>
          <WecomCtaButton label="联系主理人" from="404" subject="404 页面" />
        </div>
      </div>
    </section>
  );
}
