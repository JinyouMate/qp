"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { WecomCtaButton } from "./wecom-dialog";

/**
 * 全站固定加微入口（单一动作，无表单、无次级按钮）。
 * - 桌面：右侧圆形按钮，滚过一屏后出现
 * - 移动：底部固定条，仅一个「联系主理人」按钮
 * - 表单页 /contact、加微页 /wechat、后台 /admin 不显示
 */
export function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden =
    dismissed || pathname === "/contact" || pathname === "/wechat" || pathname?.startsWith("/admin");

  if (hidden || !show) return null;

  return (
    <>
      {/* 桌面：右侧圆形按钮 */}
      <div className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        <div className="group relative">
          <WecomCtaButton
            from="float-desktop"
            subject="悬浮条"
            iconOnly
            ariaLabel="联系主理人"
            className="h-12 w-12 rounded-full p-0 shadow-warm-lg transition-transform hover:scale-105"
          />
          <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
            联系主理人
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex h-7 w-12 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-warm hover:text-foreground"
          aria-label="隐藏"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 移动：底部固定条，唯一动作 */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center border-t bg-card/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <WecomCtaButton
          from="float-mobile"
          subject="悬浮条"
          label="联系主理人"
          className="w-full rounded-full py-2.5 text-sm font-semibold shadow-warm"
        />
      </div>
    </>
  );
}
