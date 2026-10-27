import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

const SYSTEM_PROMPT = `你是「汽配知识局」官网的 AI 助手。汽配知识局是汽配行业知识资产运营商，做九类产品：知识库、数据产品、SOP、行业报告、培训课程、咨询方案、SaaS工具、内容IP、AI数据标注/模型训练。

你的职责：
1. 用中文回答汽配行业相关问题，专业、直接、给具体动作，不说空话。
2. 涉及选品、适配数据、定价、平台规则、跨境（Ozon/eBay/Temu/Jumia）等问题时，给可操作的步骤。
3. 不知道就说不知道，不要编造数据。可以说"这块建议加企微找真人确认"。
4. 当用户表现出明确需求时，引导留资：领资料去 /contact?intent=asset，预约咨询去 /contact?intent=consult，加企微去 /wechat。
5. 不卖货、不代运营、不碰交易，官网不处理支付。
6. 回答控制在 200 字以内，不要用 Markdown 标题。`;

/** 未配置密钥时的兜底回复：依然引导留资，不让对话断掉 */
function fallbackReply(lastUserMessage: string): string {
  const t = lastUserMessage;
  if (/资料|清单|SOP|模板|免费|领/.test(t)) {
    return "免费资料（SOP 清单、报告摘要、模板库）在 /contact 留资后就能拿，或者加企微备注「官网」更快。";
  }
  if (/价格|收费|多少钱|费用/.test(t)) {
    return "课程 ¥999–3,980/门，报告 ¥899–1,999/份，数据订阅 ¥699 起/月（支持 7 天试用），咨询 ¥30,000 起/项目。具体看 /products。";
  }
  if (/合作|AI|标注|语料|评测|SaaS/.test(t)) {
    return "AI 数据合作（语料授权、标注规则、评测标准共建）和 SaaS 合作在 /partners，签 DPA 后启动。可以先在 /contact 提交意向。";
  }
  if (/咨询|诊断|内训|方案/.test(t)) {
    return "咨询与内训先做 30 分钟免费诊断：/contact?intent=consult，把你的业务规模、卡点和目标写清楚，我们判断能不能帮上。";
  }
  return "这个问题我记下了。更准确的答案建议加企微（/wechat）找真人确认，也可以在 /contact 留下你的问题，我们按情况回复。";
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ reply: "请求格式错误。" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ reply: "消息格式不正确。" }, { status: 422 });
  }

  const { messages } = parsed.data;
  const last = messages[messages.length - 1]?.content ?? "";

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  // 未配置密钥：走兜底，不暴露任何配置细节
  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(last), mode: "fallback" });
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!res.ok) {
      console.error("[ai] 上游返回", res.status);
      return NextResponse.json({ reply: fallbackReply(last), mode: "fallback" });
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || fallbackReply(last), mode: "llm" });
  } catch (e) {
    console.error("[ai] 调用失败:", e);
    return NextResponse.json({ reply: fallbackReply(last), mode: "fallback" });
  }
}
