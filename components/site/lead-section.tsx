import Link from "next/link";
import { Gift, MessageCircle, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { LeadForm } from "./lead-form";

/**
 * 全站统一的资料领取区块。
 * 任何页面底部都可挂这个区块，作为访客的联系入口。
 */
export function LeadSection({
  tag = "免费资料",
  title = "留个联系方式，先把免费资料拿走",
  desc = "填一次表，SOP 清单、报告摘要、模板库全部解锁；我们只在你需要的时侯联系你。",
  defaultRole,
  defaultDemand,
  bullets,
}: {
  tag?: string;
  title?: string;
  desc?: string;
  defaultRole?: string;
  defaultDemand?: string;
  bullets?: string[];
}) {
  const list = bullets ?? [
    "《选品SOP》《平台入驻SOP》《报价核价SOP》PDF 清单",
    "行业报告精华摘要（核心数据 + 一页决策建议）",
    "一线在用的表格模板（飞书可直接复制）",
  ];

  return (
    <section id="lead" className="section-pad bg-brand-cream">
      <div className="container-site">
        <SectionHeading tag={tag} title={title} desc={desc} />
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_1.1fr]">
          <Card className="h-fit border-brand-green/15 bg-brand-green-soft/55">
            <CardContent className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Gift className="h-5 w-5 text-brand-orange" /> 现在登记就能拿走
              </h3>
              <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/85">
                {list.map((b, i) => (
                  <li key={b} className="flex gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i % 2 === 0 ? "bg-brand-orange" : "bg-brand-green"}`} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-brand-orange/15 bg-white/85 p-4 text-sm shadow-warm">
                <p className="font-semibold">更快的路：直接联系主理人</p>
                <p className="mt-1 text-muted-foreground">
                  备注「官网」秒通过，资料直接发你，还能进对应身份的社群。
                </p>
                <Button asChild variant="orange" size="sm" className="mt-3">
                  <Link href="/wechat">
                    <MessageCircle /> 联系主理人
                  </Link>
                </Button>
              </div>
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                信息只用于资料发送与业务联系，可随时要求删除，详见
                <Link href="/privacy" className="underline underline-offset-2">
                  隐私政策
                </Link>
                。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <LeadForm defaultRole={defaultRole} defaultDemand={defaultDemand} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
