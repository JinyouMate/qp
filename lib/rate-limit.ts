/* ============================================================
   极简内存限流（滑动窗口）
   - 只用于单实例 / 单 Lambda 内的粗粒度防刷，不能替代 WAF
   - 留资提交、订单查询等公开写接口都套一层，避免被脚本刷
   - 生产建议再叠加 Vercel Firewall 或 Upstash Redis 限流
   ============================================================ */

interface Window {
  hits: number[];
}

const buckets = new Map<string, Window>();

/** 定期清理，避免长期运行内存膨胀 */
const MAX_KEYS = 5000;

export interface RateResult {
  ok: boolean;
  /** 还剩多少次 */
  remaining: number;
  /** 建议多少秒后重试（ok=true 时为 0） */
  retryAfter: number;
}

/**
 * @param key   限流键（一般用 IP + 接口名）
 * @param limit 窗口内允许的次数
 * @param windowMs 窗口长度（毫秒）
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) buckets.clear();

  const w = buckets.get(key) ?? { hits: [] };
  w.hits = w.hits.filter((t) => now - t < windowMs);

  if (w.hits.length >= limit) {
    const oldest = w.hits[0];
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, w);
    return { ok: false, remaining: 0, retryAfter };
  }

  w.hits.push(now);
  buckets.set(key, w);
  return { ok: true, remaining: limit - w.hits.length, retryAfter: 0 };
}

/** 取客户端 IP：优先 Vercel / Cloudflare 头，回落到 unknown */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}
