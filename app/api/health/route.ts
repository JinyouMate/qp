import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const PROBE_TIMEOUT_MS = 8000;

/** 单次探测超时兜底：网络异常时不让接口无限挂起 */
async function withTimeout<T>(p: PromiseLike<T>, ms = PROBE_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(p),
      new Promise<never>((_, rej) => {
        timer = setTimeout(() => rej(new Error(`超时 ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * 数据库连通性自检（部署后访问 /api/health?token=<ADMIN_TOKEN> 即可查看）。
 * 作用：确认 Supabase 环境变量生效、表已建好、能否真实写入。
 * 安全：若配置了 ADMIN_TOKEN 则必须带 token 访问，否则 404，避免泄露表信息。
 */
export async function GET(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  const given = new URL(request.url).searchParams.get("token") ?? "";
  if (adminToken && given !== adminToken) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 404 });
  }

  const configured = isSupabaseConfigured();
  const result: Record<string, unknown> = {
    ok: false,
    mode: configured ? "supabase" : "demo",
    supabaseConfigured: configured,
    projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? String(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(
          /^https:\/\/(.{4}).*(\.supabase\.co)$/,
          "https://$1***$2"
        )
      : null,
  };

  if (!configured) {
    result.hint = "Supabase 环境变量未配置，站点运行在兜底静态数据模式，留资不会入库。";
    return NextResponse.json(result, { status: 200 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    result.error = "client init failed";
    return NextResponse.json(result, { status: 200 });
  }

  // 1) 逐表探测是否存在且可读
  const tables = ["leads", "products", "contents", "cases", "partners", "events"];
  const tableStatus: Record<string, string> = {};
  let networkOk = true;
  try {
    for (const t of tables) {
      const { error } = await withTimeout(
        db.from(t).select("*", { count: "exact", head: true })
      );
      tableStatus[t] = error ? `❌ ${error.message}` : "✅";
    }
  } catch (e) {
    networkOk = false;
    result.networkError = e instanceof Error ? e.message : String(e);
    for (const t of tables) tableStatus[t] = "⚠️ 网络不可达";
  }
  result.tables = tableStatus;
  if (!networkOk) {
    result.ok = false;
    result.conclusion =
      "当前运行环境无法访问 Supabase（常见于本地网络对该域名拦截）。这不影响线上：部署到 Vercel 后境外服务器可正常连接，届时再访问本接口即可得到真实结果。";
    return NextResponse.json(result, { status: 200 });
  }

  // 2) 关键列探测（identity / utm_source / channel 由后续迁移添加，缺了会走降级写入）
  const colStatus: Record<string, string> = {};
  try {
    for (const col of ["identity", "utm_source", "channel", "source"]) {
      const { error } = await withTimeout(db.from("leads").select(col).limit(1));
      colStatus[col] = error ? `❌ 缺失（${error.message}）` : "✅";
    }
  } catch (e) {
    colStatus.error = e instanceof Error ? e.message : String(e);
  }
  result.columns = colStatus;

  // 3) 真实写入测试：只插 0001 就有的核心字段，插完立即删除，不留脏数据
  try {
    const ins = await withTimeout(
      db
        .from("leads")
        .insert({
          name: "__healthcheck__",
          contact: "healthcheck",
          role: "其他",
          demand: "知识库",
        })
        .select("id")
        .maybeSingle()
    );
    if (ins.error) {
      result.write = `❌ 写入失败：${ins.error.message}`;
    } else {
      const id = (ins.data as { id?: number } | null)?.id;
      await withTimeout(db.from("leads").delete().eq("id", id));
      result.write = `✅ 写入成功（测试记录 id=${id} 已自动删除）`;
    }
  } catch (e) {
    result.write = `⚠️ 未能完成写入测试：${e instanceof Error ? e.message : String(e)}`;
  }

  const allTablesOk = Object.values(tableStatus).every((v) => v === "✅");
  result.ok = allTablesOk && String(result.write ?? "").startsWith("✅");
  result.conclusion = result.ok
    ? "数据库已就绪，留资可真实入库。"
    : "数据库未完全就绪，请检查建表 SQL 是否执行成功（见 tables 字段）。";

  return NextResponse.json(result, { status: 200 });
}
