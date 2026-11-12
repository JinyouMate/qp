/* eslint-disable @next/next/no-img-element */

import { WecomCtaButton } from "@/components/site/wecom-dialog";
import { WECOM } from "@/lib/brand";

/* ============================================================
   全站唯一的转化收口大卡片（替代原表单模块）

   策略：官网不设任何表单、不收集任何信息。
   所有页面底部只做一件事 —— 把访客交给主理人企微。
   首页与内页共用同一个组件，保证视觉与话术完全一致。
   ============================================================ */

/** 全站内页统一引导文案（唯一来源，勿在页面里另写一份） */
export const WECOM_LEAD_TEXT =
  "扫描下方二维码，添加主理人企微，立即获取完整数据资料或诊断服务。";

export function WecomCtaCard({
  title = "别再靠运气选品，用真实数据拿回利润。",
  desc = WECOM_LEAD_TEXT,
  badge = "一对一 · 企微直连",
  buttonLabel = "立即扫码添加主理人",
  footnote = "点击扫码，立即获取完整资料（备注官网优先通过）",
  from = "wecom-cta-card",
  subject,
  showQr = true,
  className = "",
}: {
  title?: string;
  desc?: string;
  badge?: string;
  buttonLabel?: string;
  footnote?: string;
  /** 触发位置，用于埋点区分来源 */
  from?: string;
  /** 触发主体（页面名 / 产品名） */
  subject?: string;
  /** 是否展示可直接扫的二维码（首页沿用旧版式，传 false） */
  showQr?: boolean;
  className?: string;
}) {
  return (
    <section className={`section-pad bg-[#FFF7EE] ${className}`}>
      <div className="container-site">
        <div className="mx-auto max-w-3xl rounded-3xl border border-brand-orange/25 bg-white px-6 py-12 text-center shadow-sun md:px-12 md:py-16">
          <span className="inline-block rounded-full bg-brand-orange/10 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-orange-ink">
            {badge}
          </span>

          <h2 className="mt-5 text-2xl font-bold leading-snug md:text-4xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {desc}
          </p>

          {showQr && (
            <div className="mx-auto mt-8 w-fit rounded-2xl border border-brand-green/10 bg-white p-3 shadow-warm">
              <img
                src={WECOM.qr}
                alt="主理人企业微信二维码"
                width={176}
                height={176}
                className="h-40 w-40 rounded-lg object-contain md:h-44 md:w-44"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                微信扫一扫 · 备注「{WECOM.remark}」优先通过
              </p>
            </div>
          )}

          <WecomCtaButton
            size="lg"
            variant="orange"
            label={buttonLabel}
            from={from}
            subject={subject ?? title}
            className="mt-8 h-16 w-full max-w-md rounded-2xl text-lg font-bold shadow-warm-lg md:h-[72px] md:text-xl"
          />

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
