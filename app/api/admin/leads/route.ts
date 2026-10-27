import { NextResponse } from "next/server";

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { CHANNEL_LABELS, type Channel } from "@/lib/types";

export const runtime = "nodejs";

/** 简单的后台口令校验（header x-admin-token 或 ?token=） */
function authorized(req: Request): boolean {
  const secret = process.env.ADMIN_TOKEN;
  if (!secret) return false;
  const header = req.headers.get("x-admin-token") ?? "";
  const query = new URL(req.url).searchParams.get("token") ?? "";
  return header === secret || query === secret;
}

const COLUMNS = [
  "id", "created_at", "name", "contact", "role", "identity", "demand",
  "description", "channel", "utm_source", "status", "source", "utm",
] as const;

interface LeadRow {
  id: number;
  created_at: string;
  name: string;
  contact: string;
  role: string;
  identity: string | null;
  demand: string;
  description: string | null;
  channel: string;
  utm_source: string | null;
  status: string;
  source: string | null;
  utm: Record<string, string> | null;
}

function esc(v: unknown): string {
  const s =
    v === null || v === undefined
      ? ""
      : typeof v === "object"
        ? JSON.stringify(v)
        : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

/** 按字段做分组计数 */
function groupCount(
  rows: LeadRow[],
  field: "role" | "demand" | "channel" | "identity" | "utm_source"
) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = (r[field] as string) || "未填写";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/** ISO 时间 → 北京时间日期键（YYYY-MM-DD） */
function dayKeyCN(iso: string): string {
  const t = new Date(iso).getTime() + 8 * 3600 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

/** 按天统计留资数，区间内无数据的日期补 0（缺少区间时取最近 14 天） */
function dailySeries(rows: LeadRow[], from: string | null, to: string | null) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = dayKeyCN(r.created_at);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const todayCN = dayKeyCN(new Date().toISOString());
  const start = from ?? (() => {
    const d = new Date(new Date(`${todayCN}T00:00:00Z`).getTime() - 13 * 864e5);
    return d.toISOString().slice(0, 10);
  })();
  const end = to ?? todayCN;

  const days: { day: string; count: number }[] = [];
  for (let t = new Date(`${start}T00:00:00Z`).getTime(); ; t += 864e5) {
    const key = new Date(t).toISOString().slice(0, 10);
    days.push({ day: key, count: counts.get(key) ?? 0 });
    if (key >= end || days.length > 400) break;
  }
  return days;
}

/** 事件统计（events 表不存在时返回 null，看板自动降级） */
async function loadEvents(
  db: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  from: string | null,
  to: string | null
) {
  let q = db.from("events").select("event,created_at").order("created_at", { ascending: false });
  if (from) q = q.gte("created_at", `${from}T00:00:00.000Z`);
  if (to) q = q.lte("created_at", `${to}T23:59:59.999Z`);
  const { data, error } = await q.limit(20000);
  if (error) return null;
  return (data ?? []) as { event: string; created_at: string }[];
}

/** 身份 × 需求 交叉表 */
function crossTab(rows: LeadRow[]) {
  const roles = Array.from(new Set(rows.map((r) => r.role || "未填写")));
  const demands = Array.from(new Set(rows.map((r) => r.demand || "未填写")));
  const cell = new Map<string, number>();
  for (const r of rows) {
    const k = `${r.role || "未填写"}||${r.demand || "未填写"}`;
    cell.set(k, (cell.get(k) ?? 0) + 1);
  }
  return {
    roles,
    demands,
    matrix: roles.map((role) => ({
      role,
      cells: demands.map((d) => ({ demand: d, count: cell.get(`${role}||${d}`) ?? 0 })),
      total: rows.filter((r) => (r.role || "未填写") === role).length,
    })),
  };
}

/**
 * 未接 Supabase 时的演示数据：形状与真实一致，值由日期哈希生成（同一天稳定）。
 * 前端会显示「演示数据」标记，避免误读。
 */
function demoPayload(from: string | null, to: string | null) {
  const todayCN = dayKeyCN(new Date().toISOString());
  const start =
    from ??
    new Date(new Date(`${todayCN}T00:00:00Z`).getTime() - 13 * 864e5)
      .toISOString()
      .slice(0, 10);
  const end = to ?? todayCN;

  const daily: { day: string; count: number }[] = [];
  for (let t = new Date(`${start}T00:00:00Z`).getTime(); ; t += 864e5) {
    const key = new Date(t).toISOString().slice(0, 10);
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    daily.push({ day: key, count: (h % 7) + (key === todayCN ? 2 : 0) });
    if (key >= end || daily.length > 400) break;
  }

  const total = daily.reduce((s, d) => s + d.count, 0);
  const ratio = (p: number) => Math.round(total * p);

  return {
    ok: true,
    demo: true,
    count: 0,
    range: { from, to },
    leads: [],
    stats: {
      byRole: [],
      byDemand: [],
      byChannel: [],
      bySource: [],
      cross: { roles: [], demands: [], matrix: [] },
    },
    dashboard: {
      eventsTracked: false,
      daily,
      today: daily.length ? daily[daily.length - 1].count : 0,
      events: [],
      funnel: [
        { key: "leads", label: "留资提交", count: total, rate: 100 },
        { key: "wechat_click", label: "加微信点击", count: ratio(0.62), rate: 62 },
        { key: "asset_download", label: "资料领取", count: ratio(0.41), rate: 41 },
        { key: "third_party_click", label: "第三方跳转", count: ratio(0.18), rate: 18 },
        { key: "consult_click", label: "预约咨询", count: ratio(0.07), rate: 7 },
      ],
      qualified: ratio(0.55),
    },
  };
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "未授权" }, { status: 401 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  const from = url.searchParams.get("from"); // ISO 日期，含当天 00:00
  const to = url.searchParams.get("to"); // ISO 日期，含当天 23:59

  if (!isSupabaseConfigured()) {
    if (format === "csv") {
      const header = [...COLUMNS, "channel_label"];
      return new NextResponse("\uFEFF" + header.join(","), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leads-demo-${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }
    // 未接数据库：返回明确标注的演示数据，好让看板能先看形态
    return NextResponse.json(demoPayload(from, to));
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json({ ok: false, error: "Supabase 客户端不可用" }, { status: 500 });
  }

  const buildQuery = (cols: readonly string[]) => {
    let q = db.from("leads").select(cols.join(",")).order("created_at", { ascending: false });
    if (from) q = q.gte("created_at", `${from}T00:00:00.000Z`);
    if (to) q = q.lte("created_at", `${to}T23:59:59.999Z`);
    return q.limit(5000);
  };

  let { data, error } = await buildQuery(COLUMNS);
  // 还没执行 0005 迁移时缺列：回退到旧字段，保证后台不挂
  if (error && /identity|utm_source|column/i.test(error.message)) {
    const legacy = COLUMNS.filter((c) => c !== "identity" && c !== "utm_source");
    const retry = await buildQuery(legacy);
    data = retry.data;
    error = retry.error;
  }
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as LeadRow[];

  if (format === "csv") {
    const header: string[] = [...COLUMNS, "channel_label"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          ...COLUMNS.map((c) => esc(r[c as keyof LeadRow])),
          esc(CHANNEL_LABELS[(r.channel as Channel)] ?? r.channel),
        ].join(",")
      ),
    ].join("\n");

    const range = from || to ? `-${from ?? "start"}_${to ?? "now"}` : "";
    return new NextResponse("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads${range}-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  }

  // ---------- 看板数据：每日趋势 + 事件漏斗 + 转化率 ----------
  const daily = dailySeries(rows, from, to);
  const eventRows = await loadEvents(db, from, to);
  const eventCounts = new Map<string, number>();
  for (const e of eventRows ?? []) {
    eventCounts.set(e.event, (eventCounts.get(e.event) ?? 0) + 1);
  }

  const leads = rows.length;
  const pct = (n: number) => (leads > 0 ? Math.round((n / leads) * 1000) / 10 : 0);

  const wechat = eventCounts.get("wechat_click") ?? 0;
  const thirdParty = eventCounts.get("third_party_click") ?? 0;
  const asset = eventCounts.get("asset_download") ?? 0;
  const consult = eventCounts.get("consult_click") ?? 0;

  const dashboard = {
    eventsTracked: eventRows !== null,
    daily,
    today: daily.length ? daily[daily.length - 1].count : 0,
    events: Array.from(eventCounts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count),
    funnel: [
      { key: "leads", label: "留资提交", count: leads, rate: 100 },
      { key: "wechat_click", label: "加微信点击", count: wechat, rate: pct(wechat) },
      { key: "asset_download", label: "资料领取", count: asset, rate: pct(asset) },
      { key: "third_party_click", label: "第三方跳转", count: thirdParty, rate: pct(thirdParty) },
      { key: "consult_click", label: "预约咨询", count: consult, rate: pct(consult) },
    ],
    // 高质量线索：填了具体问题的，通常成功率更高
    qualified: rows.filter((r) => (r.description ?? "").trim().length > 5).length,
  };

  return NextResponse.json({
    ok: true,
    count: rows.length,
    range: { from, to },
    leads: rows,
    stats: {
      // 0005 之前的老数据没有新列，用 role / channel 兜底，统计口径不断裂
      byRole: groupCount(
        rows.map((r) => ({ ...r, identity: r.identity || r.role })),
        "identity"
      ),
      byDemand: groupCount(rows, "demand"),
      bySource: groupCount(
        rows.map((r) => ({ ...r, utm_source: r.utm_source || r.channel })),
        "utm_source"
      ),
      byChannel: groupCount(rows, "channel").map((g) => ({
        ...g,
        label: CHANNEL_LABELS[g.key as Channel] ?? g.key,
      })),
      cross: crossTab(rows),
    },
    dashboard,
  });
}
