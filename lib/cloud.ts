import { createWorkBuddyCloud } from "@tencent-ai/workbuddy-cloud-sdk";

import { CLOUD_PUBLIC_CONFIG } from "./cloud-config";

/* ============================================================
   WorkBuddy 云服务客户端（服务端使用）

   全站只初始化一次，所有模块复用同一个实例。
   endpoint / publishableKey 一律来自 publicConfig（lib/cloud-config.ts），
   绝不手写域名、绝不从环境变量或 location 拼装。

   ⚠️ 重要：leads / events 两张表只开了 INSERT 策略（不开 SELECT，避免手机号
   被任何人读走）。PostgREST 的 insert().select() 走 RETURNING，会被 SELECT
   策略挡掉并报「violates row-level security policy」—— 所以这里**插入时不回读**，
   拿不到自增 id 也不需要，Supabase 那边的 id 才是主键。
   ============================================================ */

type CloudClient = ReturnType<typeof createWorkBuddyCloud>;

let cached: CloudClient | null = null;

export function getCloudClient(): CloudClient {
  if (!cached) {
    cached = createWorkBuddyCloud({
      endpoint: CLOUD_PUBLIC_CONFIG.endpoint,
      oauthRelayBaseUrl: CLOUD_PUBLIC_CONFIG.oauthRelayBaseUrl,
      publishableKey: CLOUD_PUBLIC_CONFIG.publishableKey,
    });
  }
  return cached;
}

/**
 * 云数据库的宽松视图。SDK 的 PostgREST 泛型在未传入生成的 Database 类型时
 * 会把行类型收成 never，这里只做一层薄封装，不改变任何运行时行为。
 */
type QueryResult = { data: unknown; error: { message: string } | null };

type Selectable = { maybeSingle(): Promise<QueryResult> } & PromiseLike<QueryResult>;
type Builder = { select(cols: string): Selectable } & PromiseLike<QueryResult>;

interface CloudDatabase {
  from(table: string): {
    insert(values: Record<string, unknown>): Builder;
    delete(): { eq(col: string, val: unknown): Builder };
  };
}

function db(): CloudDatabase {
  return getCloudClient().database as unknown as CloudDatabase;
}

/** 请求兜底超时：云服务异常时不能把接口挂死 */
const TIMEOUT_MS = 8_000;

async function withTimeout<T>(work: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const guard = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("云服务请求超时")), ms);
  });
  try {
    return await Promise.race([work, guard]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type CloudResult = { ok: boolean; error?: string };

/**
 * 写入留资线索到云数据库 leads 表。
 * 表上 RLS 只允许 INSERT，且 owner_id 由 DEFAULT auth.uid() 服务端填充，
 * 因此这里**不传 owner_id**，也**不回读**。
 */
export async function cloudInsertLead(row: Record<string, unknown>): Promise<CloudResult> {
  try {
    const res = await withTimeout(Promise.resolve(db().from("leads").insert(row)));
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "云服务异常" };
  }
}

/** 写入埋点事件到云数据库 events 表 */
export async function cloudInsertEvent(row: {
  event: string;
  props?: Record<string, unknown>;
  path?: string | null;
}): Promise<CloudResult> {
  try {
    const res = await withTimeout(
      Promise.resolve(
        db()
          .from("events")
          .insert({ event: row.event, props: row.props ?? {}, path: row.path ?? null })
      )
    );
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "云服务异常" };
  }
}

/**
 * 清理自检事件（RLS 只允许删 event='__healthcheck__' 的行）。
 * 返回删除条数与错误信息，便于 /api/health 直接暴露失败原因，不静默吞错。
 */
export async function cloudClearProbeEvents(): Promise<{
  cleaned: number;
  error?: string;
}> {
  try {
    const res = await withTimeout(
      Promise.resolve(db().from("events").delete().eq("event", "__healthcheck__").select("id"))
    );
    if (res.error) return { cleaned: 0, error: res.error.message };
    return { cleaned: Array.isArray(res.data) ? res.data.length : 0 };
  } catch (e) {
    return { cleaned: 0, error: e instanceof Error ? e.message : "云服务异常" };
  }
}
