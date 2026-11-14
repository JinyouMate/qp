import Link from "next/link";

import { BRAND } from "@/lib/brand";
import { BrandLogo } from "./brand-logo";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "三库服务",
    links: [
      { href: "/products", label: "服务目录" },
      { href: "/products#lib-kb", label: "知识库" },
      { href: "/products#lib-tools", label: "工具库" },
      { href: "/products#lib-data", label: "数据库（金游智库账号）" },
      { href: "/consulting", label: "定制咨询" },
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
              汽配行业知识资产运营商——知识库建认知，工具库做落地，数据库看利润。
              从知识到工具，从工具到数据。
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
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="break-words text-xs leading-relaxed text-gray-400">
            © 2026 {BRAND.name} · 金游™ 出品 |{" "}
            {/* 公司名与权利声明绑定为一个不可断行的整体，窄屏时整体换到下一行，
                避免出现「保 / 留所有权利」这种把词拆开的断行。 */}
            <span className="whitespace-nowrap">{BRAND.legalEntity} 保留所有权利</span>
          </p>
          <p className="mt-2 break-words text-xs leading-relaxed text-gray-400">
            本站为知识资产与数据展示平台
          </p>
        </div>
      </div>
    </footer>
  );
}
