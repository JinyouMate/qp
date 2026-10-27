import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { cloudInsertEvent } from "@/lib/cloud";

export const runtime = "nodejs";

/** 与 lib/analytics.ts 的 TrackEventName 保持一致，缺一个就会被静默丢弃 */
const EVENTS = [
  "form_submit",
  "wechat_click",
  "third_party_click",
  "asset_download",
  "consult_click",
  "ai_chat_open",
  "ladder_click",
  "planet_join_intent",
  "planet_copy",
  "wecom_qr_view",
] as const;

const Schema = z.object({
  event: z.enum(EVENTS),
  props: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  path: z.string().max(300).optional(),
  channel: z.string().max(30).optional(),
  referrer: z.string().max(500).optional(),
  ts: z.string().max(40).optional(),
});

/**
 * 事件落库端点（供 /admin 看板算转化率）。
 * 未接 Supabase 时返回 ok:true 但不落库，前端无感。
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "非法请求体" }, { status: 400 });
  }

  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "事件格式不正确" }, { status: 422 });
  }

  /* ---------- 云服务（WorkBuddy）events 表 ---------- */
  const cloud = await cloudInsertEvent({
    event: parsed.data.event,
    props: { ...(parsed.data.props ?? {}), channel: parsed.data.channel ?? null },
    path: parsed.data.path ?? null,
  });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      stored: cloud.ok,
      demo: !cloud.ok,
      cloud: { ok: cloud.ok, error: cloud.error ?? null },
    });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json({
      ok: true,
      stored: cloud.ok,
      cloud: { ok: cloud.ok, error: cloud.error ?? null },
    });
  }

  const { error } = await db.from("events").insert({
    event: parsed.data.event,
    props: parsed.data.props ?? {},
    path: parsed.data.path ?? null,
    channel: parsed.data.channel ?? null,
    referrer: parsed.data.referrer ?? null,
    created_at: parsed.data.ts ?? new Date().toISOString(),
  });

  // 表不存在（未执行 0004 迁移）时不要让浏览器报错
  if (error) {
    return NextResponse.json({
      ok: true,
      stored: cloud.ok,
      cloud: { ok: cloud.ok, error: cloud.error ?? null },
      error: error.message,
    });
  }

  return NextResponse.json({
    ok: true,
    stored: true,
    cloud: { ok: cloud.ok, error: cloud.error ?? null },
  });
}
