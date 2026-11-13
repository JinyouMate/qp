import { cn } from "@/lib/utils";

/**
 * 极简品牌标记：一条索引轴 + 三条递减的知识条目。
 * 语义是「结构化的数据与行业知识」，纯线条、无底色、无阴影，
 * 用品牌橙作标识色，与全站行动色（按钮）统一暖色阵营。
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-[22px] w-[22px] shrink-0 text-brand-orange", className)}
    >
      <path d="M4 3v18" />
      <path d="M4 7.5h15M4 12h10.5M4 16.5h6" />
    </svg>
  );
}

/**
 * 文字型 Logo：中文主名 + 英文副标题。
 * 不包 Link，由调用方决定是否可点击，便于同时用在导航（client）与页脚（server）。
 */
export function BrandLogo({
  showSubtitle = true,
  className,
}: {
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="leading-tight">
        <span className="block text-[17px] font-bold tracking-[0.03em] text-[#1F2937]">
          汽配知识局
        </span>
        {showSubtitle && (
          <span className="mt-0.5 block whitespace-nowrap text-[10px] tracking-[0.08em] text-muted-foreground">
            JINYOU DATA · 金游™
          </span>
        )}
      </span>
    </span>
  );
}
