import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 已彻底下线的路由，统一返回 301 永久重定向：
 * - /cases  内容已合并进 /content
 * - /admin  线索看板随全站表单下线一并关闭（表单已无数据来源，且含输入框）
 *
 * 为什么不用 next.config 的 redirects：
 * Next.js 的 redirects 只支持 307/308（permanent: true → 308），无法输出 301；
 * 同时 Cloudflare Pages 在 `_worker.js` 高级模式下会忽略 public/_redirects。
 * 因此这里用 middleware 显式返回 301 永久重定向，并保留原查询串。
 */
export const config = {
  matcher: ["/cases", "/cases/:path*", "/admin", "/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const target = request.nextUrl.clone();
  target.pathname = request.nextUrl.pathname.startsWith("/admin") ? "/" : "/content";
  return NextResponse.redirect(target, 301);
}
