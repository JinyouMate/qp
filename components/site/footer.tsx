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
      { href: "/about", label: "关于我们" },
    ],
  },
  {
    title: "支持与合规",
    links: [
      { href: "/access", label: "查询我的资料权限" },
      { href: "/privacy", label: "隐私政策" },
      { href: "/terms", label: "服务条款" },
    ],
  },
];

export function Footer() {
  /* 页脚是页面最后一个元素：移动端额外留 120px 安全区（>=100px），
     保证滚动到底时加微按钮、二维码说明与页脚文字都不会被底部固定悬浮条遮挡。 */
  return (
    <footer className="border-t border-brand-green/10 bg-brand-cream pb-[120px] text-muted-foreground lg:pb-0">
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
          <p className="text-center text-xs leading-relaxed text-gray-500">
            {"本站为知识资产与数据展示站点。不销售汽配实体商品，不代运营店铺，不代收货款。所有知识产品与数据服务，均由主理人在企业微信完成一对一交付。"}
          </p>
        </div>
      </div>
    </footer>
  );
}
