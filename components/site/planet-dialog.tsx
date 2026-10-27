"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Copy, Loader2, MessageCircle, QrCode, ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { PlanetNote } from "./planet-note";
import { PLANET } from "@/lib/brand";
import { getStoredUtm, withPlanetUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";

/* ============================================================
   加入知识星球弹窗（唯一的成交收口）

   规则（必须遵守）：
   1. 点击【加入知识星球】**不直接跳转**，先留资
   2. 线索必须落到 leads 表（走 /api/leads，自动带 UTM 与渠道）
   3. 留资成功后才下发两个动作：复制星球链接 / 加企微领新人礼
   4. 星球链接固定带 utm_source=website&utm_medium=product&utm_campaign={id}
   5. 全程明确「第三方平台提供交易支持，本站不收款、不做支付」
   ============================================================ */

const ROLES = ["修理厂", "汽配商", "平台企业", "AI公司"] as const;

export function PlanetDialog({
  product,
  open,
  onOpenChange,
  demand,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  demand: string;
}) {
  /**
   * 星球入口优先级：
   *   本产品 planet_url → 老字段 third_party_url → 全局兜底 PLANET.defaultUrl
   * 都没有则为 ""，弹窗走「加企微」降级，绝不跳死链。
   */
  const rawUrl =
    product.planet_url || product.third_party_url || PLANET.defaultUrl || null;
  const target = rawUrl ? withPlanetUtm(rawUrl, product.id) : "";

  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("汽配商");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // 关闭后重置，避免把上一次的联系方式留给下一个人
  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setError("");
      setSubmitting(false);
      setCopied(false);
      setShowQr(false);
    }
  }, [open]);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("请先勾选同意《隐私政策》");
      return;
    }
    if (contact.trim().length < 5) {
      setError("请填写手机号或微信号（至少 5 个字符）");
      return;
    }

    setSubmitting(true);
    try {
      const stored = getStoredUtm();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "未填写",
          contact: contact.trim(),
          role,
          demand,
          description: `加入意向：${product.name}（${product.slug}）· 已下发知识星球入口与新人资料包`,
          consent: true,
          utm: stored,
          channel: stored.channel ?? "direct",
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "提交失败，请稍后再试");
      }

      trackEvent("form_submit", {
        role,
        demand,
        channel: stored.channel ?? "direct",
        variant: "planet_dialog",
        product: product.slug,
      });

      setSubmitted(true);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "提交失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  }

  /** 复制星球链接：优先 Clipboard API，失败回退到 textarea + execCommand */
  async function copyLink() {
    if (!target) return;
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(target);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = target;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }

    trackEvent("planet_copy", {
      product: product.slug,
      campaign: String(product.id),
      ok,
    });
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 3000);
  }

  function toggleQr() {
    const next = !showQr;
    setShowQr(next);
    if (next) {
      trackEvent("wecom_qr_view", { from: "planet_dialog", product: product.slug });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitted ? "你的星球入口已准备好" : `加入知识星球 · ${product.name}`}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "复制链接去微信打开，或加企微让我们直接把入口发给你。"
              : "为保证服务质量，请先留下你的微信/手机号，我们将发送专属星球入口和新人资料包。"}
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          /* ---------------- 第一步：留资 ---------------- */
          <form onSubmit={submitLead} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="planet-contact">手机号 / 微信 *</Label>
              <Input
                id="planet-contact"
                placeholder="例如 13800138000 或 微信号"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="planet-name">怎么称呼你（选填）</Label>
              <Input
                id="planet-name"
                placeholder="姓或昵称都行"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>你的身份</Label>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={
                      "rounded-full border px-3 py-1 text-xs transition-colors " +
                      (role === r
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id="planet-consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
              />
              <Label
                htmlFor="planet-consent"
                className="text-xs font-normal leading-relaxed text-muted-foreground"
              >
                我已阅读并同意
                <Link
                  href="/privacy"
                  target="_blank"
                  className="mx-1 text-primary underline-offset-2 hover:underline"
                >
                  《隐私政策》
                </Link>
                ，同意将以上信息用于星球入口与资料发送。
              </Label>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" variant="orange" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              提交，获取星球入口 <ArrowRight />
            </Button>

            <PlanetNote platform={product.third_party_platform ?? PLANET.name} />
          </form>
        ) : (
          /* ---------------- 第二步：两个动作 ---------------- */
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md bg-brand-green-soft p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={1.5} />
              <p className="text-xs leading-relaxed text-foreground/85">
                已收到你的联系方式。专属星球入口与新人资料包稍后会发给你，
                也可以现在直接加入。
              </p>
            </div>

            {/* A. 复制星球链接 */}
            <Button
              variant="orange"
              size="lg"
              className="w-full text-base"
              onClick={copyLink}
              disabled={!target}
            >
              {copied ? <CheckCircle2 /> : <Copy />}
              {copied ? "已复制，去微信粘贴打开" : "复制星球链接"}
            </Button>

            {target && (
              <p className="break-all rounded-md bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                {target}
              </p>
            )}

            {/* B. 添加企微，领取新人礼 */}
            <Button variant="outline" className="w-full" onClick={toggleQr}>
              <MessageCircle />
              添加企微，领取新人礼
              <QrCode className="ml-0.5" />
            </Button>

            {showQr && (
              <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4">
                <img
                  src={PLANET.wecomQr}
                  alt="企业微信活码"
                  width={168}
                  height={168}
                  className="rounded-lg"
                  style={{ width: 168, height: 168 }}
                />
                <p className="text-center text-xs text-muted-foreground">
                  微信扫码，备注「官网 + 你要的产品」，新人资料包直接发你。
                </p>
                <Link
                  href={`${PLANET.wecomPath}?from=planet&product=${product.slug}`}
                  className="text-xs text-primary underline underline-offset-2"
                >
                  打不开？去私域入口页
                </Link>
              </div>
            )}

            {/* 解释文案 */}
            <p className="flex items-start gap-1.5 rounded-md bg-brand-cream p-3 text-[11px] leading-relaxed text-foreground/80">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-brand-green" strokeWidth={1.5} />
              <span>
                知识星球 APP 内搜索加入，或复制链接在微信中打开。{PLANET.benefit}。
              </span>
            </p>

            {/* 链接未配置的降级：只引导加企微，绝不跳死链 */}
            {!target && (
              <p className="text-xs text-muted-foreground">
                该产品的星球入口还在配置中。加企业微信，我们直接把邀请链接发给你。
              </p>
            )}

            <PlanetNote platform={product.third_party_platform ?? PLANET.name} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
