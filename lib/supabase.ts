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

/** 通用取表：失败或未配置返回 null（调用方走兜底数据） */
export async function fetchTable<T>(table: string): Promise<T[] | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from(table).select("*");
  if (error || !data) {
    console.error(`[supabase] 读取 ${table} 失败:`, error?.message);
    return null;
  }
  return data as T[];
}
