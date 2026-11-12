import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { CheckCircle2, ShieldCheck } from "lucide-react";

import { WECOM } from "@/lib/brand";

import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = buildMetadata({
  title: "添加主理人企微",
  description:
    "扫码添加主理人企业微信，备注「官网」优先通过。SOP 清单、行业报告、工具模板与同行交流群，添加后由主理人一对一交付。",
  path: "/wechat",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data],
});

/** 加上主理人之后能拿到的核心权益（只留 4 条，社群压成一句） */
const BENEFITS = [
  "《选品SOP》《平台入驻SOP》《报价核价SOP》等 PDF 清单",
  "行业报告精华摘要：核心数据、趋势判断与一页决策建议",
  "一线在用的表格模板，飞书可直接复制使用",
  "按身份进入同行交流群（修理厂 / 卖家 / 跨境 / AI 合作）",
];

export default function WechatPage() {
  return (
    <>
      <PageHero
        tag="企业微信"
        title="添加主理人企微，获取专属资料与业务诊断"
        desc="不用填表、不用注册，扫码即聊。"
      />

      <section className="section-pad pt-0">
        <div className="container-site">
          {/* 唯一主体：一张名片式的卡片，二维码居中，四周大量留白 */}
          <div className="mx-auto max-w-md rounded-3xl border border-brand-green/10 bg-white px-6 py-10 text-center shadow-warm md:px-10 md:py-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WECOM.qr}
              alt="企业微信二维码：扫码添加主理人，备注「官网」优先通过"
              width={240}
              height={240}
              className="mx-auto h-60 w-60 rounded-2xl object-contain"
              style={{ width: 240, height: 240 }}
            />
            <p className="mt-5 text-sm font-semibold text-foreground">
              扫码添加，备注【官网】优先通过。
            </p>

            <div className="mt-8 border-t border-border pt-6 text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-brand-orange-ink">
                加上之后你会拿到
              </p>
              <ul className="mt-4 space-y-3">
                {BENEFITS.map((t, i) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        i % 2 === 0 ? "text-brand-green" : "text-brand-orange"
                      }`}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 全页仅此一句免责：官网不碰交易 */}
          <p className="mx-auto mt-6 flex max-w-md items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
            <span>官网不处理支付、不代收货款。资料与诊断由主理人在企业微信内一对一交付。</span>
          </p>
        </div>
      </section>
    </>
  );
}
