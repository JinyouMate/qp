/* ============================================================
   极简数据终端（Geek Terminal）
   纯 HTML/CSS 渲染，不使用任何图片、截图或 canvas 占位。
   深色面板 + 圆角 + 微弱发光阴影，用来呈现底层数据规模。
   ============================================================ */

const LOG_LINES: { body: string; value: string; tone: "ok" | "num" }[] = [
  { body: "INIT DATA PIPELINE...", value: "SUCCESS", tone: "ok" },
  { body: "312,0450 SKUs", value: "LOADED", tone: "num" },
  { body: "931 SUPPLIERS", value: "VERIFIED", tone: "num" },
  { body: "MARGIN BAND:", value: "40.0% - 50.0%", tone: "num" },
];

export function DataTerminal() {
  return (
    <div className="relative isolate mx-auto w-full max-w-[380px]">
      {/* 极弱的弥散发光，不铺满、不抢主视觉 */}
      <div
        aria-hidden="true"
        className="absolute -inset-5 -z-10 rounded-[32px] bg-brand-green/20 blur-2xl"
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1620] font-mono shadow-[0_20px_50px_-20px_rgba(13,22,32,0.7),0_0_28px_-14px_rgba(31,111,74,0.55)]">
        {/* 窗口条 */}
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-[#FF605C]/80" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD44]/80" />
          <span className="h-2 w-2 rounded-full bg-[#00CA4E]/80" />
          <span className="ml-3 truncate text-[10px] tracking-wide text-slate-400">
            qipei://data-pipeline
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-emerald-300/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>

        {/* 日志行：编号 + 提示符 + 命令 + 结果值 */}
        <div className="space-y-2.5 px-4 py-5 text-[11px] leading-relaxed sm:text-xs">
          {LOG_LINES.map((line, i) => (
            <div key={line.body} className="flex gap-3 whitespace-nowrap">
              <span className="w-4 shrink-0 select-none text-right text-white/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-emerald-400">&gt;</span>
              <span className="min-w-0 truncate text-slate-300">
                {line.body}{" "}
                <span
                  className={
                    line.tone === "ok"
                      ? "font-semibold text-emerald-300"
                      : "font-semibold text-orange-300"
                  }
                >
                  {line.value}
                </span>
              </span>
            </div>
          ))}
          <div aria-hidden="true" className="flex gap-3 pt-0.5">
            <span className="w-4 shrink-0" />
            <span className="text-emerald-400">&gt;</span>
            <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400/80" />
          </div>
        </div>

        {/* 底部状态条 */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[10px] text-slate-500">
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
