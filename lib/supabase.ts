import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 服务端 Supabase 客户端（service role，绕过 RLS，仅用于 API Route / 服务端组件）。
 * 未配置环境变量时返回 null，站点自动降级为本地兜底数据（demo 模式）。
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** 给 Supabase 请求加超时，避免网络不通时构建/渲染长时间挂起 */
function withTimeout<T>(p: PromiseLike<T>, ms = 8000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    Promise.resolve(p),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`supabase timeout ${ms}ms`)), ms);
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  }) as Promise<T>;
}

/**
 * 一旦探测到数据库不可达（超时/网络异常），本次进程内后续读取直接降级，
 * 避免构建 52 个页面时每页都干等 8 秒。
 */
let dbUnreachable = false;

/** 通用取表：失败或未配置返回 null（调用方走兜底数据） */
export async function fetchTable<T>(table: string): Promise<T[] | null> {
  const db = getSupabaseAdmin();
  if (!db || dbUnreachable) return null;
  try {
    const { data, error } = await withTimeout(db.from(table).select("*"));
    if (error || !data) {
      console.error(`[supabase] 读取 ${table} 失败:`, error?.message);
      return null;
    }
    return data as T[];
  } catch (e) {
    dbUnreachable = true;
    console.error(`[supabase] 读取 ${table} 超时/异常，本进程内后续读取直接降级:`, e instanceof Error ? e.message : e);
    return null;
  }
}
