import { ShieldCheck } from "lucide-react";

/**
 * 加入区统一免责小字：出现在产品卡、详情页购买区、加入弹窗底部。
 * 一句话说清「钱不进本站、内容在星球里」，既是合规要求，也能降低跳转流失。
 */
export function PlanetNote({
  platform,
  className,
}: {
  platform?: string | null;
  className?: string;
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
        加入与交付由第三方社群平台{platform ? `（${platform}）` : "（知识星球）"}提供。
        本站不收款、不代收货款，付款与内容查阅均在第三方平台完成。
      </span>
    </p>
  );
}
