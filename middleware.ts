import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 已彻底下线的路由，统一返回 301 永久重定向：
 * - /cases                    内容已合并进 /content
 * - /admin                    线索看板随全站表单下线一并关闭（表单已无数据来源，且含输入框）
 * - /courses                  培训课程体系已砍掉，改为「数据订阅与会员版」
 * - /products/courses         同上（原课程产品详情）
 * - /products/annual-pass     年度知识通行证已下线（原权益含课程与社群答疑）
 *
 * 为什么不用 next.config 的 redirects：
 * Next.js 的 redirects 只支持 307/308（permanent: true → 308），无法输出 301；
 * 同时 Cloudflare Pages 在 `_worker.js` 高级模式下会忽略 public/_redirects。
 * 因此这里用 middleware 显式返回 301 永久重定向，并保留原查询串。
 */
const RETIRED: Record<string, string> = {
  "/cases": "/content",
  "/admin": "/",
  "/courses": "/products/data-subscription",
  "/products/courses": "/products/data-subscription",
  "/products/annual-pass": "/products/data-subscription",
};

export const config = {
  matcher: [
    "/cases",
    "/cases/:path*",
    "/admin",
    "/admin/:path*",
    "/courses",
    "/courses/:path*",
    "/products/courses",
    "/products/annual-pass",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const key = Object.keys(RETIRED).find(
    (k) => pathname === k || pathname.startsWith(`${k}/`)
  );
  const target = request.nextUrl.clone();
  target.pathname = key ? RETIRED[key] : "/";
  return NextResponse.redirect(target, 301);
}
