"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackEvent, type TrackEventName, type TrackProps } from "@/lib/analytics";

/**
 * 带埋点的站内链接。点击时先上报事件再跳转，不做任何视觉改动。
 * 用法：<TrackedLink href="/wechat" event="wechat_click" data={{ from: "float" }}>…</TrackedLink>
 */
export function TrackedLink({
  href,
  event,
  data,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  event: TrackEventName;
  data?: TrackProps;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackEvent(event, data ?? {})}
    >
      {children}
    </Link>
  );
}
