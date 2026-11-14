/* ============================================================
   极简数据卡片（Light Data Card）
   纯 HTML/CSS 渲染，不使用任何图片、截图或 canvas 占位。
   纯白卡片 + 柔和弥散阴影，融入明亮的智库风格页面。
   ============================================================ */

type LogLine = {
  label: string;
  /** 关键数字，加粗品牌绿 */
  value?: string;
  /** 状态词，浅灰小字 */
  status?: string;
};

const LOG_LINES: LogLine[] = [
  { label: "INIT DATA PIPELINE", status: "SUCCESS" },
  { label: "SKUs", value: "3,124,045", status: "LOADED" },
  { label: "SUPPLIERS", value: "931", status: "VERIFIED" },
  { label: "MARGIN BAND", value: "40%-50%" },
];

export function DataTerminal() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="overflow-hidden rounded-2xl border border-brand-gray/80 bg-white font-mono shadow-[0_24px_48px_-28px_rgba(31,41,55,0.28),0_2px_10px_-6px_rgba(31,41,55,0.08)]">
        {/* 窗口条 */}
        <div className="flex items-center gap-1.5 border-b border-brand-gray/70 bg-[#FCFBF8] px-4 py-3">
          <span className="h-2 w-2 rounded-full border border-[#D8D2C7]" />
          <span className="h-2 w-2 rounded-full border border-[#D8D2C7]" />
          <span className="h-2 w-2 rounded-full border border-[#D8D2C7]" />
          <span className="ml-3 truncate text-[10px] tracking-wide text-[#BDB7AC]">
            qipei://金游数据智库
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[10px] font-medium tracking-widest text-brand-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />
            LIVE
          </span>
        </div>

        {/* 日志行：序号 + 提示符 + 条目 + 数字 + 状态 */}
        <div className="space-y-2.5 px-4 py-5 text-[11px] leading-relaxed sm:text-xs">
          {LOG_LINES.map((line, i) => (
            <div key={line.label} className="flex min-w-0 items-baseline gap-2.5">
              <span className="w-4 shrink-0 select-none text-right text-[#D2CCC1]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="shrink-0 text-[#C6C0B5]">&gt;</span>
              <span className="min-w-0 truncate text-[#6B7280]">
                {line.label}
                {line.value && (
                  <>
                    {" "}
                    <span className="font-semibold text-brand-green">{line.value}</span>
                  </>
                )}
                {line.status && (
                  <>
                    {" "}
                    <span className="text-[11px] tracking-wide text-[#B3ADA2]">
                      {line.status}
                    </span>
                  </>
                )}
              </span>
            </div>
          ))}
          <div aria-hidden="true" className="flex items-center gap-2.5 pt-0.5">
            <span className="w-4 shrink-0" />
            <span className="shrink-0 text-[#C6C0B5]">&gt;</span>
            <span className="inline-block h-3 w-1.5 animate-pulse bg-[#4B5563]" />
          </div>
        </div>

        {/* 底部状态条 */}
        <div className="flex items-center justify-between border-t border-brand-gray/70 px-4 py-2.5 text-[10px] text-[#AFA99E]">
          <span>UPTIME 11 MONTHS</span>
          <span>NO ERRORS</span>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 pl-1 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
        底层系统已持续稳定运行 11 个月
      </p>
    </div>
  );
}
