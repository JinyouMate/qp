import { ArrowUpRight, Building2, TrendingUp } from "lucide-react";

/**
 * 首屏右侧：纯 CSS/Tailwind 绘制的「悬浮数据看板」· 浅色科技风
 * 不用任何图片或截图，极浅灰绿底板 + 3 张纯白弥散阴影数据卡，呼应左侧的硬核数字。
 * 动画在 globals.css 的 .hero-float-* 中定义，并支持 prefers-reduced-motion 降级。
 */

export function HeroDataBoard() {
  return (
    <div
      role="img"
      aria-label="底层数据资产概览：3,124,045 条真实 SKU、931 家源头供应商直连、40%-50% 核心黄金毛利带"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-brand-green/10 bg-[#F0F4F2] shadow-[0_22px_50px_-34px_rgba(16,45,32,0.45)]"
    >
      {/* 1. 极浅底板：白 → 灰绿的微弱渐变 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 90% at 88% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%), linear-gradient(150deg, #FFFFFF 0%, #F4F8F6 52%, #EDF3F0 100%)",
        }}
      />

      {/* 2. 极淡网格：品牌绿描线，边缘淡出 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(31,111,74,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,111,74,0.055) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "radial-gradient(110% 100% at 70% 20%, #000 12%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(110% 100% at 70% 20%, #000 12%, transparent 80%)",
        }}
      />

      {/* 3. 微弱光晕：只提供空气感，不形成体积 */}
      <div aria-hidden className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand-green/[0.07] blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-brand-orange/[0.06] blur-3xl" />

      {/* 4. 顶部状态条（原背景柱状剪影已移除） */}
      <div className="absolute inset-x-5 top-4 flex items-center justify-between sm:inset-x-6 sm:top-5">
        <span className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] text-brand-green/75 sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_7px_rgba(31,111,74,0.45)]" />
          LIVE DATA ASSET
        </span>
        <span className="font-mono text-[9px] tracking-wider text-[#8B9A92] sm:text-[10px]">
          11 MONTHS · REAL DATA
        </span>
      </div>

      {/* ============ 卡片 A（左上）：底层 SKU 库 ============ */}
      <div className="hero-float-a absolute left-[6%] top-[14%] z-30 w-[54%] rounded-2xl bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 shadow-[0_14px_34px_-14px_rgba(16,45,32,0.26),0_3px_10px_-5px_rgba(16,45,32,0.10)]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-[#8B9A92] sm:text-[10px]">
            TOTAL SKU
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
            <TrendingUp className="h-3.5 w-3.5 text-brand-green" strokeWidth={2.25} />
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-brand-green text-[clamp(18px,3.5vw,30px)]">
          3,124,045
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#5C6B63] sm:text-[11px]">
          <ArrowUpRight className="h-3 w-3 shrink-0 text-brand-green" strokeWidth={2.5} />
          底层真实 SKU 库
        </div>
      </div>

      {/* ============ 卡片 C（中下）：源头供应商 ============ */}
      <div className="hero-float-c absolute bottom-[24%] left-[7%] z-10 w-[36%] rounded-2xl bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-[0_12px_30px_-14px_rgba(16,45,32,0.22),0_2px_8px_-5px_rgba(16,45,32,0.08)]">
        <span className="flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] text-[#8B9A92] sm:text-[10px]">
          <Building2 className="h-3 w-3" strokeWidth={1.9} />
          SUPPLIERS
        </span>
        <div className="mt-1 whitespace-nowrap font-bold leading-none text-brand-green text-[clamp(18px,3.2vw,27px)]">
          931<span className="ml-1 text-[11px] font-medium text-[#5C6B63] sm:text-xs">家</span>
        </div>
        <div className="mt-1.5 whitespace-nowrap text-[10px] text-[#5C6B63] sm:text-[11px]">
          源头供应商直连
        </div>
      </div>

      {/* ============ 卡片 B（右下）：黄金毛利带 · 唯一亮橙焦点 ============ */}
      <div className="hero-float-b absolute bottom-[7%] right-[5%] z-20 w-[47%] overflow-hidden rounded-2xl bg-white px-3.5 py-3 sm:px-4 sm:py-3.5 shadow-[0_16px_38px_-15px_rgba(16,45,32,0.26),0_3px_10px_-5px_rgba(16,45,32,0.10)]">
        {/* 橙色高亮标识：左侧竖条 */}
        <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#F0782C]" />
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] font-semibold tracking-[0.16em] text-[#E07A3F] sm:text-[10px]">
            MARGIN BAND
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#F0782C]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#E07A3F] sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F0782C]" />
            黄金带
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-[#F0782C] text-[clamp(19px,3.6vw,31px)]">
          40%-50%
        </div>
        <div className="mt-1.5 text-[10px] text-[#5C6B63] sm:text-[11px]">核心黄金毛利带</div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#EAEFEC]">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#F0782C]/55 to-[#F0782C]" />
        </div>
      </div>
    </div>
  );
}
