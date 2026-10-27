"use client";

import { Info, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/* ============================================================
   线索看板：每日留资数 / 事件漏斗 / 转化率
   数据来自 /api/admin/leads 的 dashboard 字段
   ============================================================ */

export interface DashboardData {
  eventsTracked: boolean;
  daily: { day: string; count: number }[];
  today: number;
  events: { event: string; count: number }[];
  funnel: { key: string; label: string; count: number; rate: number }[];
  qualified: number;
}

const EVENT_LABELS: Record<string, string> = {
  form_submit: "表单提交",
  wechat_click: "加微信点击",
  third_party_click: "第三方跳转",
  asset_download: "资料领取",
  consult_click: "预约咨询",
  ai_chat_open: "AI 问答",
  ladder_click: "阶梯点击",
};

export function LeadDashboard({ data, demo = false }: { data: DashboardData; demo?: boolean }) {
  const max = Math.max(1, ...data.daily.map((d) => d.count));
  const total = data.funnel.find((f) => f.key === "leads")?.count ?? 0;
  const qualifiedRate = total > 0 ? Math.round((data.qualified / total) * 1000) / 10 : 0;

  return (
    <div className="mt-8 space-y-4">
      {demo && (
        <div className="flex items-start gap-2 rounded-xl border border-brand-orange/40 bg-brand-orange-soft p-4 text-xs text-accent-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <b>当前是演示数据</b>：还没配置 Supabase（或未执行迁移），下面的数字是按日期生成的示例，
            用来预览看板形态。接上数据库后自动切换为真实数据。
          </span>
        </div>
      )}

      {/* KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="线索总数" value={total} sub="当前筛选范围内" />
        <Kpi label="今日留资" value={data.today} sub="北京时间当天" />
        <Kpi
          label="高质量线索"
          value={data.qualified}
          sub={`占 ${qualifiedRate}% · 填了具体问题的`}
        />
        <Kpi
          label="加微点击"
          value={data.funnel.find((f) => f.key === "wechat_click")?.count ?? 0}
          sub={`留资的 ${data.funnel.find((f) => f.key === "wechat_click")?.rate ?? 0}%`}
        />
      </div>

      {/* 每日留资趋势 */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-green" />
            <h3 className="text-sm font-bold">每日留资数</h3>
            <span className="text-xs text-muted-foreground">
              {data.daily.length} 天 · 峰值 {max}
            </span>
          </div>
          <div className="flex h-32 items-end gap-[3px] overflow-x-auto">
            {data.daily.map((d) => (
              <div key={d.day} className="group relative flex min-w-[10px] flex-1 flex-col items-center">
                <span className="absolute -top-5 hidden whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
                  {d.day.slice(5)} · {d.count}
                </span>
                <div
                  className={`w-full rounded-t transition-colors ${
                    d.count > 0 ? "bg-brand-green group-hover:bg-brand-orange" : "bg-brand-gray"
                  }`}
                  style={{ height: `${Math.max(3, (d.count / max) * 118)}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>{data.daily[0]?.day}</span>
            <span>{data.daily[data.daily.length - 1]?.day}</span>
          </div>
        </CardContent>
      </Card>

      {/* 事件漏斗 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 text-sm font-bold">事件漏斗</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              以留资数为分母。「第三方跳转」含购买意图点击与最终跳转。
            </p>
            <ul className="space-y-3">
              {data.funnel.map((f) => (
                <li key={f.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{f.label}</span>
                    <span className="text-muted-foreground">
                      {f.count} 次 · {f.rate}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-green"
                      style={{ width: `${Math.min(100, f.rate)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 text-sm font-bold">全部事件计数</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              GA4 / Plausible 负责大盘，这张表是站内自建口径，可直接对比。
            </p>

            {!data.eventsTracked ? (
              <div className="flex items-start gap-2 rounded-lg bg-brand-orange-soft p-3 text-xs text-accent-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  还读不到 events 表（或表为空）。执行
                  <code className="mx-1 rounded bg-white/60 px-1">0004_events.sql</code>
                  迁移后，表单提交 / 加微 / 跳转 / 下载的点击都会计入，转化率才有分母。
                </span>
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.events.length === 0 ? (
                  <li className="text-xs text-muted-foreground">范围内暂无事件。</li>
                ) : (
                  data.events.map((e) => (
                    <li key={e.event} className="flex items-center justify-between">
                      <span>{EVENT_LABELS[e.event] ?? e.event}</span>
                      <span className="font-semibold">{e.count}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold text-brand-green">{value}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}
