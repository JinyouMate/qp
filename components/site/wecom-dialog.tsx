"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ADVISOR, WECOM } from "@/lib/brand";
import { trackEvent } from "@/lib/analytics";

/* ============================================================
   主理人名片弹窗（全站唯一的转化收口）

   规则（必须遵守）：
   1. 点击任何转化按钮**不跳转任何外部链接**，只弹这个窗
   2. 视觉上是「专家名片」：浅灰底 + 品牌绿，不用大红大橙
   3. 二维码旁边配主理人头像（带呼吸感的占位 Logo）
   4. 弹窗打开即埋点 wechat_click（落 Supabase events 表）
   ============================================================ */

/**
 * 全站统一的 CTA 按钮：点一下就弹主理人名片，不跳转任何链接。
 * 服务端组件页面也可直接引用（自身是 client 组件）。
 */
export function WecomCtaButton({
  label,
  size = "default",
  variant = "default",
  from = "cta-button",
  subject,
  className,
  iconOnly = false,
  ariaLabel,
}: {
  label?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "orange";
  from?: string;
  subject?: string;
  className?: string;
  /** 只显示图标（用于悬浮圆钮等无文字位） */
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={className}
        aria-label={iconOnly ? (ariaLabel ?? label ?? WECOM.ctaLabel) : undefined}
        onClick={() => setOpen(true)}
      >
        {iconOnly ? <MessageCircle className="h-5 w-5" /> : label ?? WECOM.ctaLabel}
      </Button>
      <WecomDialog open={open} onOpenChange={setOpen} from={from} subject={subject} />
    </>
  );
}

export function WecomDialog({
  open,
  onOpenChange,
  from = "site",
  subject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** 触发位置，用于埋点区分来源 */
  from?: string;
  /** 触发主体（产品名 / 页面名），仅用于埋点与副标题 */
  subject?: string;
}) {
  // 弹窗打开即视为一次「联系主理人」意向
  useEffect(() => {
    if (open) {
      trackEvent("wechat_click", { from, subject: subject ?? "" });
    }
  }, [open, from, subject]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0">
        {/* 头部：浅灰底，不用大红大橙 */}
        <div className="border-b bg-muted/60 px-6 pb-4 pt-6 text-center">
          <DialogHeader className="items-center gap-1 text-center">
            <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
              <BadgeCheck className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <DialogTitle className="text-center text-lg font-bold tracking-tight">
              {WECOM.dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              {subject ? `来自：${subject}` : "汽配知识局 · 一对一顾问服务"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 内容区：小屏（如 375×667）高度不够时区内滚动，头图与关闭按钮保持可见 */}
        <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-5">
          {/* 名片：头像与二维码并排（专家名片质感，不用大红大橙） */}
          <div className="flex items-center justify-center gap-5 rounded-2xl border bg-muted/40 p-4">
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <img
                src={ADVISOR.avatar}
                alt="主理人头像"
                width={88}
                height={88}
                className="breathe-ring rounded-2xl bg-white object-cover"
                style={{ width: 88, height: 88 }}
              />
              <span className="text-[10px] leading-none text-muted-foreground">主理人</span>
            </div>

            <span className="h-24 w-px shrink-0 bg-border" aria-hidden />

            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div className="rounded-xl border bg-white p-1.5 shadow-sm">
                <img
                  src={WECOM.qr}
                  alt="主理人企业微信二维码"
                  width={124}
                  height={124}
                  className="rounded-md"
                  style={{ width: 124, height: 124 }}
                />
              </div>
              <span className="flex items-center gap-1 text-[10px] leading-none text-muted-foreground">
                <MessageCircle className="h-3 w-3" strokeWidth={1.75} /> 微信扫一扫
              </span>
            </div>
          </div>

          {/* 身份与说明 */}
          <div className="mt-4">
            <p className="text-sm font-bold">{ADVISOR.name}</p>
            <p className="text-xs text-primary">{ADVISOR.title}</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {ADVISOR.creds.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-1 text-[11px] leading-snug text-muted-foreground"
                >
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{WECOM.note}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              添加时备注「{WECOM.remark}」优先通过
            </p>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-primary" strokeWidth={1.5} />
            <span>官网不处理支付，不收集表单信息；资料与诊断均由主理人在企业微信一对一交付。</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
