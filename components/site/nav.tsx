"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Gift, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品中心" },
  { href: "/content", label: "内容IP" },
  { href: "/cases", label: "案例" },
  { href: "/about", label: "关于" },
  { href: "/contact", label: "联系" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green text-base font-bold text-white shadow-warm">
            配
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-wide">汽配知识局</span>
            <span className="block text-[10px] tracking-[0.2em] text-muted-foreground">
              AUTO PARTS KNOWLEDGE
            </span>
          </span>
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

        {/* 右上角固定 CTA：主按钮「领取资料」，次按钮「预约咨询」 */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <Button asChild size="sm" variant="ghost">
            <Link href="/contact?intent=consult">
              <CalendarClock /> 预约咨询
            </Link>
          </Button>
          <Button asChild size="sm" variant="destructive">
            <Link href="/contact?intent=asset">
              <Gift /> 领取资料
            </Link>
          </Button>
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
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="outline" onClick={() => setOpen(false)}>
                <Link href="/contact?intent=consult">预约咨询</Link>
              </Button>
              <Button asChild size="sm" variant="destructive" onClick={() => setOpen(false)}>
                <Link href="/contact?intent=asset">领取资料</Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
