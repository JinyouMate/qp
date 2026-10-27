"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { WECOM } from "@/lib/brand";
import { trackEvent } from "@/lib/analytics";

/* ============================================================
   企微二维码弹窗（全站唯一的转化收口）

   规则（必须遵守）：
   1. 点击任何转化按钮**不跳转任何外部链接**，只弹这个窗
   2. 弹窗内居中展示企微二维码（public/wecom-qr.png）
   3. 弹窗下方固定提示：添加后自动下发内部资料库链接 + 邀请进群
   4. 二维码打开即埋点 wechat_click（白名单事件，落 Supabase events 表）
   ============================================================ */

/**
 * 全站统一的 CTA 按钮：点一下就弹企微二维码，不跳转任何链接。
 * 服务端组件页面也可直接引用（自身是 client 组件）。
 */
export function WecomCtaButton({
  label,
  size = "default",
  variant = "orange",
  from = "cta-button",
  subject,
  className,
}: {
  label?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "orange";
  from?: string;
  subject?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} variant={variant} className={className} onClick={() => setOpen(true)}>
        <MessageCircle /> {label ?? WECOM.ctaLabel}
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
  // 弹窗打开即视为一次「加企微」意向
  useEffect(() => {
    if (open) {
      trackEvent("wechat_click", { from, subject: subject ?? "" });
    }
  }, [open, from, subject]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange-soft text-brand-orange">
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <DialogTitle className="text-center text-lg">{WECOM.ctaLabel}</DialogTitle>
          <DialogDescription className="text-center">
            微信扫描下方二维码，备注「{WECOM.remark}」优先通过
            {subject ? ` · ${subject}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          {/* 二维码：换真实活码时覆盖 public/wecom-qr.png 即可，文件名不变 */}
          <div className="rounded-2xl border bg-white p-3 shadow-warm">
            <img
              src={WECOM.qr}
              alt="企业微信二维码：扫码添加，自动下发内部资料库链接"
              width={208}
              height={208}
              className="rounded-lg"
              style={{ width: 208, height: 208 }}
            />
          </div>

          {/* 固定提示语 */}
          <p className="rounded-xl bg-brand-green-soft px-4 py-3 text-center text-sm leading-relaxed text-foreground/90">
            {WECOM.note}
          </p>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-brand-green" strokeWidth={1.5} />
            <span>官网不处理支付，资料与交付全部在企业微信完成。</span>
          </p>

          <p className="text-xs text-muted-foreground">
            不方便扫码？
            <Link
              href={`/contact?intent=asset${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
              className="mx-1 text-primary underline underline-offset-2"
              onClick={() => onOpenChange(false)}
            >
              留下联系方式
            </Link>
            ，我们主动加你。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
