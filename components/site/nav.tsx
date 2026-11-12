"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "./brand-logo";
import { WecomCtaButton } from "./wecom-dialog";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/products", label: "服务目录" },
  { href: "/content", label: "数据洞察" },
  { href: "/about", label: "关于我们" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <BrandLogo />
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === l.href ? "font-semibold text-primary" : "text-foreground/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* 右上角唯一 CTA：点一下弹主理人企微名片 */}
        <div className="hidden lg:flex">
          <WecomCtaButton
            size="sm"
            variant="default"
            label="联系主理人"
            from="nav-desktop"
            subject="导航栏"
          />
        </div>

        {/* 移动端按钮 */}
        <button
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <nav className="border-t bg-card px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === l.href ? "bg-secondary text-primary" : "hover:bg-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3">
              <WecomCtaButton
                size="sm"
                variant="default"
                label="联系主理人"
                from="nav-mobile"
                subject="移动导航"
                className="w-full"
              />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
