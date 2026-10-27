import { ShieldCheck } from "lucide-react";

/**
 * 全站统一的交付声明小字（出现在产品卡、详情页、弹窗底部）。
 * 口径：资料与交付由企业微信完成，本站不收款、不做支付、不跳第三方平台。
 */
export function WecomNote({
  className,
  compact,
}: {
  className?: string;
  /** 紧凑版：只保留核心一句，用于产品卡 */
  compact?: boolean;
}) {
  return (
    <p
      className={
        className ??
        "flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground"
      }
    >
      <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-brand-green" strokeWidth={1.5} />
      <span>
        {compact
          ? "扫码加企微，自动下发内部资料库链接。"
          : "资料与交付全部在企业微信完成（扫码后自动下发内部资料库链接并邀请进群）。本站不收款、不做支付、不跳转任何第三方平台。"}
      </span>
    </p>
  );
}
