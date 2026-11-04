import { ArrowUpRight, Building2, TrendingUp } from "lucide-react";

/**
 * 首屏右侧：纯 CSS/Tailwind 绘制的「悬浮数据看板」
 * 不用任何图片或截图，深色底板 + 3 张毛玻璃数据卡，呼应左侧的硬核数字。
 * 动画在 globals.css 的 .hero-float-* 中定义，并支持 prefers-reduced-motion 降级。
 */

/* 底板背景里的装饰柱：只做视觉节奏，不承载真实数据 */
const DECOR_BARS = [22, 36, 30, 48, 42, 62, 55, 74, 68, 88, 79, 96, 84, 100, 92];

export function HeroDataBoard() {
  return (
    <div
      role="img"
      aria-label="底层数据资产概览：3,124,045 条真实 SKU、931 家源头供应商直连、40%-50% 核心黄金毛利带"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-white/10 shadow-[0_24px_60px_-24px_rgba(9,28,20,0.65)]"
    >
      {/* 1. 深色底板：品牌深绿 + 微弱渐变 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 95% at 88% 2%, rgba(47,143,91,0.38) 0%, rgba(47,143,91,0) 62%), linear-gradient(150deg, #123124 0%, #0B1D16 52%, #143A2A 100%)",
        }}
      />

      {/* 2. 科技感网格（边缘淡出，不抢卡片） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.45) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "radial-gradient(110% 100% at 70% 20%, #000 15%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(110% 100% at 70% 20%, #000 15%, transparent 78%)",
        }}
      />

      {/* 3. 柔光晕，让底板有纵深 */}
      <div aria-hidden className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-green/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-brand-orange/15 blur-3xl" />

      {/* 4. 顶部状态条 + 背景柱形纹理 */}
      <div className="absolute inset-x-5 top-4 flex items-center justify-between sm:inset-x-6 sm:top-5">
        <span className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] text-white/60 sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.9)]" />
          LIVE DATA ASSET
        </span>
        <span className="font-mono text-[9px] tracking-wider text-white/35 sm:text-[10px]">
          11 MONTHS · REAL DATA
        </span>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-5 bottom-0 flex h-24 items-end gap-[6px] opacity-[0.18] sm:inset-x-6"
      >
        {DECOR_BARS.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-300/10 to-emerald-300/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* ============ 卡片 A（左上）：底层 SKU 库 ============ */}
      <div className="hero-float-a absolute left-[6%] top-[14%] z-30 w-[54%] rounded-2xl border border-white/20 bg-white/[0.10] px-3.5 py-3 backdrop-blur-xl sm:px-4 sm:py-3.5 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-white/55 sm:text-[10px]">
            TOTAL SKU
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2.25} />
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-white text-[clamp(18px,3.5vw,30px)]">
          3,124,045
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/70 sm:text-[11px]">
          <ArrowUpRight className="h-3 w-3 shrink-0 text-emerald-400" strokeWidth={2.5} />
          底层真实 SKU 库
        </div>
      </div>

      {/* ============ 卡片 C（中下）：源头供应商 ============ */}
      <div className="hero-float-c absolute bottom-[24%] left-[7%] z-10 w-[36%] rounded-2xl border border-white/15 bg-white/[0.08] px-3 py-2.5 backdrop-blur-xl sm:px-3.5 sm:py-3 shadow-[0_14px_32px_-14px_rgba(0,0,0,0.5)]">
        <span className="flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] text-white/50 sm:text-[10px]">
          <Building2 className="h-3 w-3" strokeWidth={1.9} />
          SUPPLIERS
        </span>
        <div className="mt-1 whitespace-nowrap font-bold leading-none text-white text-[clamp(18px,3.2vw,27px)]">
          931<span className="ml-1 text-[11px] font-medium text-white/65 sm:text-xs">家</span>
        </div>
        <div className="mt-1.5 whitespace-nowrap text-[10px] text-white/65 sm:text-[11px]">
          源头供应商直连
        </div>
      </div>

      {/* ============ 卡片 B（右下）：黄金毛利带 ============ */}
      <div className="hero-float-b absolute bottom-[7%] right-[5%] z-20 w-[47%] overflow-hidden rounded-2xl border border-brand-orange/30 bg-white/[0.10] px-3.5 py-3 backdrop-blur-xl sm:px-4 sm:py-3.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)]">
        {/* 橙色高亮标识：左侧竖条 */}
        <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-brand-orange" />
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-brand-orange/90 sm:text-[10px]">
            MARGIN BAND
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-orange/20 px-1.5 py-0.5 text-[9px] font-bold text-brand-orange sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            黄金带
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-brand-orange text-[clamp(19px,3.6vw,31px)]">
          40%-50%
        </div>
        <div className="mt-1.5 text-[10px] text-white/70 sm:text-[11px]">核心黄金毛利带</div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-brand-orange/60 to-brand-orange" />
        </div>
      </div>
    </div>
  );
}
