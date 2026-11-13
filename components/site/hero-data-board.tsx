import { ArrowUpRight, Building2, TrendingUp } from "lucide-react";

/**
 * 首屏右侧：纯 CSS/Tailwind 绘制的「悬浮数据看板」· 浅色科技风（扶木生火 V3）
 * 白色/极浅灰底板 + 极浅绿色光晕 + 极细浅色网格；
 * 3 张纯白卡片使用扩散的暖橙阴影（shadow-lg shadow-orange-500/10），无硬边框；
 * 核心数字用品牌绿 / 阳光橙，英文标签用浅灰。
 * 呼吸浮动动画在 globals.css 的 .hero-float-* 中定义，支持 prefers-reduced-motion 降级。
 */

/* 浅灰文字（英文标签 / 说明），与暖白底保持克制的层次 */
const LABEL = "text-[#A6B2AB]";
const BODY = "text-[#5B6B62]";

export function HeroDataBoard() {
  return (
    <div
      role="img"
      aria-label="底层数据资产概览：3,124,045 条真实 SKU、931 家源头供应商直连、40%-50% 核心黄金毛利带"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-[#E7ECE7] bg-[#F8FBF9] shadow-sun"
    >
      {/* 1. 底板：白 → 极浅灰绿的微弱渐变，带一点暖意 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 90% at 88% 0%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0) 62%), linear-gradient(150deg, #FFFFFF 0%, #F8FBF9 52%, #F1F7F3 100%)",
        }}
      />

      {/* 2. 极细浅色网格线：品牌绿描线、边缘淡出，只做科技感装饰 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(31,111,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,111,74,0.05) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "radial-gradient(110% 100% at 70% 20%, #000 12%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(110% 100% at 70% 20%, #000 12%, transparent 80%)",
        }}
      />

      {/* 3. 极浅绿色光晕（木）+ 一点阳光橙光晕（火）：只提供空气感，不形成体积 */}
      <div aria-hidden className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand-green/[0.10] blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-brand-orange/[0.07] blur-3xl" />

      {/* 4. 顶部状态条（深色柱状剪影已彻底移除） */}
      <div className="absolute inset-x-5 top-4 flex items-center justify-between sm:inset-x-6 sm:top-5">
        <span className={`flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] sm:text-[10px] ${LABEL}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green/80" />
          LIVE DATA ASSET
        </span>
        <span className={`font-mono text-[9px] tracking-wider sm:text-[10px] ${LABEL}`}>
          11 MONTHS · REAL DATA
        </span>
      </div>

      {/* ============ 卡片 A（左上）：底层 SKU 库 ============ */}
      <div className="hero-float-a absolute left-[6%] top-[14%] z-30 w-[54%] rounded-2xl bg-white px-3.5 py-3 shadow-lg shadow-orange-500/10 sm:px-4 sm:py-3.5">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-[9px] font-semibold tracking-[0.16em] sm:text-[10px] ${LABEL}`}>
            TOTAL SKU
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
            <TrendingUp className="h-3.5 w-3.5 text-brand-green" strokeWidth={2.25} />
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-brand-green text-[clamp(18px,3.5vw,30px)]">
          3,124,045
        </div>
        <div className={`mt-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] ${BODY}`}>
          <ArrowUpRight className="h-3 w-3 shrink-0 text-brand-green" strokeWidth={2.5} />
          底层真实 SKU 库
        </div>
      </div>

      {/* ============ 卡片 C（中下）：源头供应商 ============ */}
      <div className="hero-float-c absolute bottom-[24%] left-[7%] z-10 w-[36%] rounded-2xl bg-white px-3 py-2.5 shadow-lg shadow-orange-500/10 sm:px-3.5 sm:py-3">
        <span className={`flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] sm:text-[10px] ${LABEL}`}>
          <Building2 className="h-3 w-3" strokeWidth={1.9} />
          SUPPLIERS
        </span>
        <div className="mt-1 whitespace-nowrap font-bold leading-none text-brand-green text-[clamp(18px,3.2vw,27px)]">
          931<span className={`ml-1 text-[11px] font-medium sm:text-xs ${BODY}`}>家</span>
        </div>
        <div className={`mt-1.5 whitespace-nowrap text-[10px] sm:text-[11px] ${BODY}`}>
          源头供应商直连
        </div>
      </div>

      {/* ============ 卡片 B（右下）：黄金毛利带 · 唯一阳光橙焦点 ============ */}
      <div className="hero-float-b absolute bottom-[7%] right-[5%] z-20 w-[47%] overflow-hidden rounded-2xl bg-white px-3.5 py-3 shadow-lg shadow-orange-500/10 sm:px-4 sm:py-3.5">
        {/* 阳光橙高亮标识：左侧竖条 */}
        <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-brand-orange" />
        <div className="flex items-center justify-between gap-1">
          <span className={`whitespace-nowrap text-[9px] font-semibold tracking-[0.1em] sm:text-[10px] sm:tracking-[0.16em] ${LABEL}`}>
            MARGIN BAND
          </span>
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-orange-ink sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            黄金带
          </span>
        </div>
        <div className="mt-1.5 whitespace-nowrap font-bold leading-none tracking-tight text-brand-orange text-[clamp(19px,3.6vw,31px)]">
          40%-50%
        </div>
        <div className={`mt-1.5 text-[10px] sm:text-[11px] ${BODY}`}>核心黄金毛利带</div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#EDF1EC]">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-brand-orange/55 to-brand-orange" />
        </div>
      </div>
    </div>
  );
}
