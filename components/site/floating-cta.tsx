"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, X } from "lucide-react";

import { TrackedLink } from "./tracked-link";
import { WecomCtaButton } from "./wecom-dialog";

/**
 * 全站固定留资入口。
 * - 桌面：右侧竖排按钮（领取资料 / 加微信），滚过一屏后出现
 * - 移动：底部固定条（领取资料 / 预约咨询 / 加微信）
 * - 表单页 /contact、私域页 /wechat、后台 /admin 不显示（避免自己挡自己）
 * - 每个按钮都带事件埋点：asset_download / consult_click / wechat_click
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
      {/* 桌面：右侧竖排 */}
      <div className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        <div className="group relative">
          <WecomCtaButton
            from="float-desktop"
            subject="悬浮条"
            className="h-12 w-12 rounded-full p-0 shadow-warm-lg transition-transform hover:scale-105"
          />
          <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
            扫码加企微
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

      {/* 移动：底部固定条（主按钮扫码加企微，次按钮站内预约咨询） */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t bg-card/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <WecomCtaButton
          from="float-mobile"
          subject="悬浮条"
          className="flex-1 rounded-full px-3 py-2.5 text-sm font-semibold shadow-warm"
        />
        <TrackedLink
          href="/contact?intent=consult"
          event="consult_click"
          data={{ from: "float-mobile" }}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-brand-red px-3 py-2.5 text-sm font-semibold text-brand-red"
        >
          <CalendarClock className="h-4 w-4" /> 预约咨询
        </TrackedLink>
      </div>
    </>
  );
}
