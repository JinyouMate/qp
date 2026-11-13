/* ============================================================
   首页「真实交易大盘洞察」图表面板
   纯 SVG + CSS 渲染，零第三方依赖、零图片、零客户端 JS。
   三张图：11 个月大盘趋势 / 黄金毛利带分布 / Top 15 品牌覆盖
   ============================================================ */

/* ---------- 图 1：11 个月大盘趋势（SKU 累计 + 在营供应商） ---------- */
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月"];
/** SKU 累计（万条） */
const SKU_SERIES = [126, 150, 174, 200, 221, 240, 261, 282, 297, 308, 312];
/** 在营供应商（家） */
const SUPPLIER_SERIES = [664, 690, 720, 748, 776, 800, 826, 852, 876, 902, 931];

const VB_W = 340;
const VB_H = 140;
const PLOT_TOP = 10;
const PLOT_H = 120;
const PAD_L = 4;
const PAD_R = 4;

function pointX(i: number) {
  return PAD_L + (i * (VB_W - PAD_L - PAD_R)) / (MONTHS.length - 1);
}

/** SKU：0 ~ 340 万 */
function skuY(v: number) {
  return PLOT_TOP + (1 - v / 340) * PLOT_H;
}

/** 供应商：600 ~ 1000 家 */
function supplierY(v: number) {
  return PLOT_TOP + (1 - (v - 600) / 400) * PLOT_H;
}

const skuPath = SKU_SERIES.map((v, i) => `${i === 0 ? "M" : "L"}${pointX(i).toFixed(1)},${skuY(v).toFixed(1)}`).join(" ");
const skuArea = `${skuPath} L${pointX(SKU_SERIES.length - 1).toFixed(1)},${(PLOT_TOP + PLOT_H).toFixed(1)} L${pointX(0).toFixed(1)},${(PLOT_TOP + PLOT_H).toFixed(1)} Z`;
const supplierPath = SUPPLIER_SERIES.map(
  (v, i) => `${i === 0 ? "M" : "L"}${pointX(i).toFixed(1)},${supplierY(v).toFixed(1)}`
).join(" ");

/* ---------- 图 2：黄金毛利带分布（千条） ---------- */
const MARGIN_BANDS = [
  { label: "<20%", value: 62 },
  { label: "20–30%", value: 148 },
  { label: "30–40%", value: 372 },
  { label: "40–50%", value: 486, highlight: true },
  { label: "50–60%", value: 348 },
  { label: ">60%", value: 202 },
];
const MARGIN_MAX = 486;

/* ---------- 图 3：Top 15 品牌覆盖（千条） ---------- */
const TOP_BRANDS = [
  { name: "MEKEDE", value: 268 },
  { name: "TOYOTA", value: 251 },
  { name: "BOSCH", value: 226 },
  { name: "DENSO", value: 214 },
  { name: "NGK", value: 190 },
  { name: "VALEO", value: 170 },
  { name: "MANN", value: 157 },
  { name: "SKF", value: 140 },
  { name: "ATE", value: 127 },
  { name: "KYB", value: 108 },
  { name: "SACHS", value: 102 },
  { name: "MAHLE", value: 96 },
  { name: "HENGST", value: 76 },
  { name: "TRW", value: 56 },
  { name: "LEMFÖRDER", value: 46 },
];
const BRAND_MAX = 268;

function ChartCard({
  title,
  hint,
  children,
  footnote,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-brand-green/10 bg-white p-5 shadow-warm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-bold text-brand-green">{title}</h3>
        <span className="shrink-0 text-[10px] tracking-wide text-muted-foreground">{hint}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
      {footnote && (
        <p className="mt-auto pt-4 text-[11px] leading-relaxed text-muted-foreground">{footnote}</p>
      )}
    </div>
  );
}

export function DataDashboard() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* ========== 图 1：11 个月大盘趋势 ========== */}
      <ChartCard
        title="11 个月真实大盘趋势"
        hint="累计口径"
        footnote="实线为 SKU 累计规模，虚线为在营供应商数量。"
      >
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-[3px] w-4 rounded-full bg-brand-green" />
            SKU 累计（万条）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-brand-orange" />
            在营供应商（家）
          </span>
        </div>

        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-[168px] w-full"
          role="img"
          aria-label="11 个月真实大盘趋势：SKU 累计从 126 万条增长至 312 万条，在营供应商从 664 家增长至 931 家"
        >
          <defs>
            <linearGradient id="skuFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F6F4A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1F6F4A" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* 网格线 */}
          {[0, 0.5, 1].map((r) => (
            <line
              key={r}
              x1={PAD_L}
              x2={VB_W - PAD_R}
              y1={PLOT_TOP + r * PLOT_H}
              y2={PLOT_TOP + r * PLOT_H}
              stroke="#EFEDE7"
              strokeWidth="1"
              strokeDasharray={r === 1 ? "0" : "3 4"}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={skuArea} fill="url(#skuFill)" />
          <path
            d={skuPath}
            fill="none"
            stroke="#1F6F4A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={supplierPath}
            fill="none"
            stroke="#EA580C"
            strokeWidth="1.8"
            strokeDasharray="5 4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 月份标签：放在 SVG 外，避免非等比拉伸把文字压扁 */}
        <div className="mt-2 flex justify-between text-[9px] text-[#A8A29A]">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-brand-green/10 pt-2 text-[10px] text-muted-foreground">
          <span>
            期末 312<span className="text-[9px]">万条</span>
          </span>
          <span>931 家供应商</span>
        </div>
      </ChartCard>

      {/* ========== 图 2：核心黄金毛利带分布 ========== */}
      <ChartCard
        title="核心黄金毛利带分布"
        hint="商品数 · 千条"
        footnote="40%–50% 区间占比 30%，是主推选品的锚点。"
      >
        <div className="flex h-[176px] items-end gap-2">
          {MARGIN_BANDS.map((b) => {
            const h = Math.max(6, (b.value / MARGIN_MAX) * 128);
            return (
              <div key={b.label} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                <span
                  className={`text-[10px] tabular-nums ${
                    b.highlight ? "font-bold text-brand-orange" : "text-muted-foreground"
                  }`}
                >
                  {b.value}
                </span>
                <div
                  className={`relative flex w-full items-start justify-center rounded-t-[3px] ${
                    b.highlight
                      ? "bg-brand-orange shadow-[0_10px_22px_-12px_rgba(234,88,12,0.65)]"
                      : "border border-brand-green/15 bg-brand-green-soft"
                  }`}
                  style={{ height: `${h}px` }}
                >
                  {b.highlight && (
                    <span className="mt-2 text-[10px] font-bold text-white">30%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 border-t border-brand-green/10 pt-2">
          {MARGIN_BANDS.map((b) => (
            <span
              key={b.label}
              className={`flex-1 text-center text-[9px] ${
                b.highlight ? "font-semibold text-brand-orange" : "text-muted-foreground"
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>
      </ChartCard>

      {/* ========== 图 3：Top 15 主流品牌覆盖 ========== */}
      <ChartCard
        title="Top 15 主流品牌覆盖"
        hint="SKU 覆盖量 · 千条"
        footnote="条越长代表该品牌适配库越完整，选品可先从这里切入。"
      >
        <div className="space-y-[7px]">
          {TOP_BRANDS.map((b, i) => {
            const ratio = b.value / BRAND_MAX;
            const isTop = i === 0;
            return (
              <div key={b.name} className="flex items-center gap-2">
                <span
                  className={`w-[62px] shrink-0 truncate text-[9px] tracking-tight ${
                    isTop ? "font-bold text-brand-orange" : "text-[#7C8B82]"
                  }`}
                  title={b.name}
                >
                  {b.name}
                </span>
                <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#F2F0EA]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(6, ratio * 100)}%`,
                      backgroundColor: isTop
                        ? "#EA580C"
                        : `rgba(31, 111, 74, ${(0.22 + ratio * 0.55).toFixed(2)})`,
                    }}
                  />
                </div>
                <span className="w-[22px] shrink-0 text-right text-[9px] tabular-nums text-[#A8A29A]">
                  {b.value}
                </span>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
