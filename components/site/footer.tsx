import Link from "next/link";

import { BRAND } from "@/lib/brand";
import { BrandLogo } from "./brand-logo";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "产品与服务",
    links: [
      { href: "/products", label: "产品中心" },
      { href: "/knowledge", label: "知识库与SOP" },
      { href: "/courses", label: "培训课程" },
      { href: "/reports", label: "报告与数据产品" },
      { href: "/consulting", label: "咨询与内训" },
      { href: "/partners", label: "SaaS与AI合作" },
    ],
  },
  {
    title: "内容与信任",
    links: [
      { href: "/insights", label: "汽配行业洞察" },
      { href: "/content", label: "客户成果与洞察" },
      { href: "/cases", label: "案例" },
      { href: "/about", label: "关于我们" },
      { href: "/wechat", label: "私域入口" },
    ],
  },
  {
    title: "支持与合规",
    links: [
      { href: "/contact", label: "联系与留资" },
      { href: "/access", label: "查询我的资料权限" },
      { href: "/privacy", label: "隐私政策" },
      { href: "/terms", label: "服务条款" },
      { href: "/wechat#platforms", label: "第三方平台入口" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-green/10 bg-brand-cream text-muted-foreground">
      <div className="container-site py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center">
              <BrandLogo />
            </Link>
            <p className="text-sm leading-relaxed">
              汽配行业知识资产运营商——把隐性知识变成可交易资产。
              从数据到决策，从知识到工具。
            </p>
            <p className="mt-3 text-xs">
              📮
              <a
                href={BRAND.emailHref}
                className="ml-1 underline-offset-2 transition-colors hover:text-brand-orange-ink hover:underline"
              >
                {BRAND.email}
              </a>
            </p>
            <p className="mt-1 text-xs">💬 企微：官网扫码添加，备注「官网」优先通过</p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm transition-colors hover:text-brand-orange-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-2 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 {BRAND.name} · {BRAND.legalEntity} · 保留所有权利
          </p>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/80">
            本站为知识资产展示与留资站点，不销售汽车配件、不代运营店铺、不代收货款。
            课程、知识库与数据产品由第三方平台完成交易与交付，站内所有第三方链接均已附加来源参数用于统计。
          </p>
        </div>
      </div>
    </footer>
  );
}
