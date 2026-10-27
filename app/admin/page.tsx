"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download, KeyRound, Loader2, AlertCircle, CalendarRange,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHANNEL_LABELS, type Channel } from "@/lib/types";
import { LeadDashboard, type DashboardData } from "@/components/site/lead-dashboard";

interface Lead {
  id: number;
  created_at: string;
  name: string;
  contact: string;
  role: string;
  demand: string;
  description: string | null;
  channel: string;
  status: string;
  source: string | null;
  utm: Record<string, string> | null;
  identity?: string | null;
  utm_source?: string | null;
}

interface Group {
  key: string;
  count: number;
  label?: string;
}

interface Stats {
  byRole: Group[];
  byDemand: Group[];
  byChannel: Group[];
  bySource: Group[];
  cross: {
    roles: string[];
    demands: string[];
    matrix: { role: string; cells: { demand: string; count: number }[]; total: number }[];
  };
}

const TOKEN_KEY = "qipei_admin_token";

/* ---------- 周维度快捷筛选 ---------- */
function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfWeek(base = new Date()) {
  const d = new Date(base);
  const day = (d.getDay() + 6) % 7; // 周一为 0
  d.setDate(d.getDate() - day);
  return d;
}

function presets() {
  const now = new Date();
  const thisMon = startOfWeek(now);
  const lastMon = new Date(thisMon);
  lastMon.setDate(lastMon.getDate() - 7);
  const lastSun = new Date(thisMon);
  lastSun.setDate(lastSun.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return [
    { key: "all", label: "全部", from: "", to: "" },
    { key: "thisWeek", label: "本周", from: iso(thisMon), to: iso(now) },
    { key: "lastWeek", label: "上周", from: iso(lastMon), to: iso(lastSun) },
    { key: "last7", label: "近 7 天", from: iso(new Date(now.getTime() - 6 * 864e5)), to: iso(now) },
    { key: "thisMonth", label: "本月", from: iso(monthStart), to: iso(now) },
  ];
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [preset, setPreset] = useState("thisWeek");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  const range = useMemo(() => {
    if (preset === "custom") return { from: customFrom, to: customTo };
    return presets().find((p) => p.key === preset) ?? { from: "", to: "" };
  }, [preset, customFrom, customTo]);

  async function load(useToken: string, r: { from: string; to: string }) {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (r.from) qs.set("from", r.from);
      if (r.to) qs.set("to", r.to);
      const res = await fetch(`/api/admin/leads?${qs.toString()}`, {
        headers: { "x-admin-token": useToken },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "读取失败");
      setLeads(data.leads ?? []);
      setStats(data.stats ?? null);
      setDashboard(data.dashboard ?? null);
      setDemo(Boolean(data.demo));
      localStorage.setItem(TOKEN_KEY, useToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : "读取失败");
      setLeads([]);
      setStats(null);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    const qs = new URLSearchParams({ format: "csv" });
    if (range.from) qs.set("from", range.from);
    if (range.to) qs.set("to", range.to);
    qs.set("token", token);
    const a = document.createElement("a");
    a.href = `/api/admin/leads?${qs.toString()}`;
    a.download = `leads-${range.from || "all"}_${range.to || "now"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const visible = leads.filter(
    (l) =>
      !filter ||
      l.name.includes(filter) ||
      l.contact.includes(filter) ||
      (l.identity ?? l.role).includes(filter) ||
      (l.utm_source ?? "").includes(filter) ||
      l.demand.includes(filter)
  );

  const channelLabel = (c: string) => CHANNEL_LABELS[c as Channel] ?? c;

  return (
    <div className="container-site py-12">
      <h1 className="text-2xl font-bold">线索后台</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        读取 Supabase <code className="rounded bg-muted px-1">leads</code> 表。
        默认按<b className="text-foreground">本周</b>筛选，可按身份 / 需求 / 来源渠道分类后导出 CSV。
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="token" className="flex items-center gap-1.5">
              <KeyRound className="h-4 w-4" /> 后台口令
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ADMIN_TOKEN"
              />
              <Button onClick={() => load(token, range)} disabled={!token || loading}>
                {loading && <Loader2 className="animate-spin" />} 读取线索
              </Button>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label className="flex items-center gap-1.5">
              <CalendarRange className="h-4 w-4" /> 时间范围（用于每周导出）
            </Label>
            <div className="flex flex-wrap gap-2">
              {[...presets(), { key: "custom", label: "自定义", from: "", to: "" }].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    preset === p.key
                      ? "border-brand-green bg-brand-green text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {preset === "custom" && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="sm:max-w-[180px]"
                />
                <span className="text-sm text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="sm:max-w-[180px]"
                />
                <Button variant="outline" onClick={() => load(token, range)} disabled={!token || loading}>
                  应用
                </Button>
              </div>
            )}
            {(range.from || range.to) && (
              <p className="text-xs text-muted-foreground">
                当前范围：{range.from || "起始"} → {range.to || "至今"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button variant="outline" onClick={exportCsv} disabled={!token || leads.length === 0}>
              <Download /> 导出当前范围 CSV（{leads.length} 条）
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPreset("thisWeek");
                load(token, presets()[1]);
              }}
              disabled={!token || loading}
            >
              回到本周
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-destructive/40 bg-brand-red-soft p-4 text-sm text-brand-red">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* 数据看板：每日留资 / 事件漏斗 / 转化率 */}
      {dashboard && <LeadDashboard data={dashboard} demo={demo} />}

      {/* 分类统计 */}
      {stats && leads.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["byRole", "byDemand", "bySource", "byChannel"] as const).map((k) => {
            const title =
              k === "byRole"
                ? "按身份"
                : k === "byDemand"
                  ? "按需求"
                  : k === "bySource"
                    ? "按 utm_source"
                    : "按来源渠道";
            return (
              <Card key={k}>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-bold">
                    {title}
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      {stats[k].length} 类
                    </span>
                  </h3>
                  <ul className="space-y-1.5">
                    {stats[k].map((g) => (
                      <li key={g.key} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate">{g.label ?? g.key}</span>
                        <span className="w-16 shrink-0">
                          <span
                            className="block h-1.5 rounded-full bg-brand-green"
                            style={{
                              width: `${Math.max(6, (g.count / leads.length) * 100)}%`,
                            }}
                          />
                        </span>
                        <span className="w-8 shrink-0 text-right font-semibold">{g.count}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 身份 × 需求 交叉表 */}
      {stats && stats.cross.matrix.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-bold">身份 × 需求 交叉分布</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold">身份 ＼ 需求</th>
                    {stats.cross.demands.map((d) => (
                      <th key={d} className="px-2 py-2 text-center font-semibold whitespace-nowrap">
                        {d}
                      </th>
                    ))}
                    <th className="px-2 py-2 text-center font-semibold">合计</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.cross.matrix.map((row) => (
                    <tr key={row.role} className="border-t">
                      <td className="px-2 py-2 font-medium">{row.role}</td>
                      {row.cells.map((c) => (
                        <td key={c.demand} className="px-2 py-2 text-center">
                          {c.count > 0 ? (
                            <Badge variant="secondary">{c.count}</Badge>
                          ) : (
                            <span className="text-muted-foreground">·</span>
                          )}
                        </td>
                      ))}
                      <td className="px-2 py-2 text-center font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 明细 */}
      {leads.length > 0 && (
        <>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              共 <span className="font-bold text-foreground">{leads.length}</span> 条线索
            </p>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="按姓名 / 联系方式 / 身份 / 需求筛选"
              className="sm:max-w-xs"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">时间</th>
                  <th className="px-3 py-2.5 font-semibold">姓名</th>
                  <th className="px-3 py-2.5 font-semibold">联系</th>
                  <th className="px-3 py-2.5 font-semibold">身份</th>
                  <th className="px-3 py-2.5 font-semibold">需求</th>
                  <th className="px-3 py-2.5 font-semibold">来源</th>
                  <th className="px-3 py-2.5 font-semibold">描述</th>
                  <th className="px-3 py-2.5 font-semibold">状态</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <tr key={l.id} className="border-t align-top">
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {l.created_at?.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="px-3 py-2.5 font-medium">{l.name}</td>
                    <td className="px-3 py-2.5">{l.contact}</td>
                    <td className="px-3 py-2.5">{l.role}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant="accent">{l.demand}</Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant="outline">{channelLabel(l.channel)}</Badge>
                      {l.utm_source && (
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {l.utm_source}
                        </span>
                      )}
                    </td>
                    <td className="max-w-xs px-3 py-2.5 text-xs text-muted-foreground">
                      {l.description || "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={l.status === "new" ? "destructive" : "secondary"}>
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visible.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">没有匹配的线索。</p>
          )}
        </>
      )}
    </div>
  );
}
