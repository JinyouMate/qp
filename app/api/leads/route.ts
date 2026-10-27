import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { CHANNEL_LABELS, type Channel } from "@/lib/types";
import { parseContact } from "@/lib/contact";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const CHANNELS = Object.keys(CHANNEL_LABELS) as [Channel, ...Channel[]];

const LeadSchema = z.object({
  name: z.string().trim().min(1, "请填写姓名").max(50),
  contact: z.string().trim().min(1, "请留下微信、手机或邮箱").max(80),
  role: z.string().trim().min(1, "请选择你的身份").max(30),
  demand: z.string().trim().min(1, "请选择需求方向").max(30),
  description: z.string().trim().max(2000).optional(),
  consent: z.boolean().refine((v) => v === true, "请先同意隐私政策"),
  utm: z.record(z.string()).optional(),
  channel: z.enum(CHANNELS).optional(),
  source: z.string().max(500).optional(),
  /** 蜜罐字段：真人看不见，机器人会填。非空即判定为垃圾提交 */
  website: z.string().max(200).optional(),
});

type LeadPayload = z.infer<typeof LeadSchema>;

function channelLabel(c?: Channel) {
  return c ? CHANNEL_LABELS[c] : "未知";
}

/** 身份归一化：与 leads.identity / persona.identity 取值保持一致 */
function normalizeIdentity(role: string): string {
  const map: Record<string, string> = {
    修理厂: "修理厂",
    汽配商: "汽配商",
    平台企业: "平台企业",
    平台: "平台企业",
    企业: "平台企业",
    AI公司: "AI公司",
    "AI 公司": "AI公司",
  };
  return map[role.trim()] ?? role.trim();
}

/** 来源明文：utm_source > channel > direct，便于后台直接筛选 */
function resolveUtmSource(payload: LeadPayload): string {
  const fromUtm = payload.utm?.utm_source?.trim();
  if (fromUtm) return fromUtm.slice(0, 120);
  if (payload.channel) return payload.channel;
  return "direct";
}

/* ---------- 通知：Resend 邮件 ---------- */
async function sendEmail(payload: LeadPayload, extra: { identity: string; utmSource: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) return { ok: false, reason: "未配置 Resend" };

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const kind = parseContact(payload.contact).kind;
    const kindText = kind === "phone" ? "手机" : kind === "email" ? "邮箱" : "微信/其他";
    const utmText = payload.utm
      ? Object.entries(payload.utm)
          .map(([k, v]) => `${k}=${v}`)
          .join(" · ")
      : "无";
    await resend.emails.send({
      from,
      to,
      subject: `【新线索·${channelLabel(payload.channel)}】${payload.name} · ${payload.role} · ${payload.demand}`,
      text: [
        `姓名：${payload.name}`,
        `联系方式：${payload.contact}（${kindText}）`,
        `身份：${payload.role}`,
        `需求：${payload.demand}`,
        `来源渠道：${channelLabel(payload.channel)} · utm_source=${extra.utmSource}`,
        `描述：${payload.description || "（未填写）"}`,
        `来源：${payload.source || "（未知）"}`,
        `UTM：${utmText}`,
        `时间：${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
      ].join("\n"),
    });
    return { ok: true };
  } catch (e) {
    console.error("[leads] Resend 发送失败:", e);
    return { ok: false, reason: "Resend 发送失败" };
  }
}

/* ---------- 通知：飞书机器人 ---------- */
async function sendFeishu(payload: LeadPayload, extra: { identity: string; utmSource: string }) {
  const webhook = process.env.FEISHU_WEBHOOK_URL;
  if (!webhook) return { ok: false, reason: "未配置飞书 webhook" };

  try {
    const utmText = payload.utm
      ? Object.entries(payload.utm)
          .map(([k, v]) => `${k}=${v}`)
          .join(" · ")
      : "无";
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "text",
        content: {
          text:
            `🔔 官网新线索（来源：${channelLabel(payload.channel)}）\n` +
            `姓名：${payload.name}\n` +
            `联系：${payload.contact}\n` +
            `身份：${extra.identity}｜需求：${payload.demand}\n` +
            `utm_source：${extra.utmSource}\n` +
            `描述：${payload.description || "（未填写）"}\n` +
            `来源：${payload.source || "（未知）"}\n` +
            `UTM：${utmText}`,
        },
      }),
    });
    return { ok: res.ok, reason: res.ok ? undefined : `飞书返回 ${res.status}` };
  } catch (e) {
    console.error("[leads] 飞书通知失败:", e);
    return { ok: false, reason: "飞书通知失败" };
  }
}

export async function POST(req: Request) {
  // 防刷：同 IP 每分钟 5 次、每小时 20 次
  const ip = clientIp(req);
  const perMinute = rateLimit(`lead:min:${ip}`, 5, 60_000);
  const perHour = rateLimit(`lead:hour:${ip}`, 20, 3_600_000);
  if (!perMinute.ok || !perHour.ok) {
    const retryAfter = Math.max(perMinute.retryAfter, perHour.retryAfter);
    return NextResponse.json(
      { ok: false, error: "提交太频繁了，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "请求格式错误" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "请检查填写内容", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const payload = parsed.data;

  // 蜜罐命中：静默返回成功，不给机器人任何反馈
  if (payload.website) {
    console.info("[leads] 疑似机器人提交，已忽略:", ip);
    return NextResponse.json({ ok: true, stored: false, mode: "spam" });
  }

  const identity = normalizeIdentity(payload.role);
  const utmSource = resolveUtmSource(payload);

  const row: Record<string, unknown> = {
    name: payload.name,
    contact: payload.contact,
    role: payload.role,
    demand: payload.demand,
    description: payload.description ?? null,
    utm: payload.utm ?? {},
    channel: payload.channel ?? "other",
    source: payload.source ?? null,
    status: "new",
    created_at: new Date().toISOString(),
    // 0005 新增列：后台可直接按身份与来源筛选
    identity,
    utm_source: utmSource,
  };

  let stored = false;
  let leadId: number | null = null;
  let degraded = false;

  if (isSupabaseConfigured()) {
    const db = getSupabaseAdmin();
    if (db) {
      let res = await db.from("leads").insert(row).select("id").maybeSingle();
      // 还没执行 0005 迁移时缺列：回退为旧字段，不丢线索
      if (res.error && /identity|utm_source|column/i.test(res.error.message)) {
        console.warn("[leads] leads 表缺少 identity/utm_source 列，回退旧字段写入。请执行 0005_payment.sql");
        degraded = true;
        const legacy = { ...row };
        delete legacy.identity;
        delete legacy.utm_source;
        res = await db.from("leads").insert(legacy).select("id").maybeSingle();
      }
      if (res.error) {
        console.error("[leads] 写入 Supabase 失败:", res.error.message);
      } else {
        stored = true;
        leadId = (res.data?.id as number | undefined) ?? null;
      }
    }
  } else {
    // demo 模式：线索只打日志，不落库
    console.info("[leads] demo 模式收到线索:", JSON.stringify(row));
  }

  // 通知并行发出，失败不影响用户看到成功
  const [email, feishu] = await Promise.all([
    sendEmail(payload, { identity, utmSource }),
    sendFeishu(payload, { identity, utmSource }),
  ]);

  return NextResponse.json({
    ok: true,
    stored,
    mode: stored ? "supabase" : "demo",
    id: leadId,
    identity,
    utm_source: utmSource,
    degraded,
    notify: { email: email.ok, feishu: feishu.ok },
  });
}
