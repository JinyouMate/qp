import type { Metadata } from "next";

import { buildMetadata, KEYWORDS } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { LeadSection } from "@/components/site/lead-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContents } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "内容IP",
  description: "全网同名「汽配知识局」：短视频拆解选品与避坑、深度图文讲数据与方法、月度直播讲透一个流程。",
  path: "/content",
  keywords: [KEYWORDS.knowledge, KEYWORDS.data, KEYWORDS.oe, KEYWORDS.vin],
});

const COLUMNS = [
  {
    name: "《避坑实录》",
    type: "短视频",
    platform: "抖音 / 视频号 / B站",
    desc: "一条视频讲一个具体的坑：这批货为什么不能进、这个适配数据为什么是错的、这次退货为什么赔钱。",
    freq: "每周 3 条",
  },
  {
    name: "《数据拆解》",
    type: "深度图文",
    platform: "公众号 / 知乎",
    desc: "把一线真实数据摊开讲：价格带全景、类目竞争格局、跨境平台的真实毛利结构。所有口径都注明来源。",
    freq: "每周 1 篇",
  },
  {
    name: "《一个流程讲透》",
    type: "月度直播",
    platform: "视频号",
    desc: "每月一场，用一个下午把一个流程从头到尾讲完：供应链怎么理、选品怎么测、客服话术怎么搭。回放沉淀进知识库。",
    freq: "每月 1 场",
  },
];

const ACCOUNTS = [
  { platform: "抖音", id: "汽配知识局", focus: "选品避坑 / 现场实录", freq: "每周 3 条" },
  { platform: "视频号", id: "汽配知识局", focus: "月度直播 / 案例访谈", freq: "每月 1 场" },
  { platform: "B站", id: "汽配知识局", focus: "长视频拆解 / 跨境专题", freq: "每周 1 条" },
  { platform: "公众号", id: "汽配知识局", focus: "深度图文 / 数据报告摘要", freq: "每周 1 篇" },
];

export default async function ContentPage() {
  const contents = await getContents();

  return (
    <>
      {/* 结构化数据：面包屑 */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "首页", url: "/" },
          { name: "内容IP", url: "/content" },
        ])}
      />

      <PageHero
        tag="CONTENT IP"
        title="内容都在公域，先看看再决定要不要留资"
        desc="我们不靠官网劝你相信我们，靠内容。所有平台同名「汽配知识局」，你可以先花半小时刷完，再回来。"
      >
        <Button asChild variant="outline">
          <Link href="/contact?intent=asset&demand=SOP">先领一份 SOP 清单</Link>
        </Button>
      </PageHero>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="三个栏目" title="我们只做三类内容" />
          <div className="grid gap-4 md:grid-cols-3">
            {COLUMNS.map((c) => (
              <Card key={c.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{c.type}</Badge>
                    <span className="text-xs text-muted-foreground">{c.freq}</span>
                  </div>
                  <h3 className="text-base font-bold">{c.name}</h3>
                  <p className="text-xs text-brand-orange">{c.platform}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container-site">
          <SectionHeading tag="近期内容" title="最近我们在讲什么" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((c) => (
              <Card key={c.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{c.type}</Badge>
                    <span className="text-muted-foreground">{c.platform}</span>
                    <span className="ml-auto font-semibold text-brand-orange">{c.metric}</span>
                  </div>
                  <h3 className="text-[15px] font-bold leading-snug">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.summary}</p>
                  <p className="mt-auto pt-2 text-xs text-muted-foreground">{c.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            内容里讲到的清单、表格、数据来源，留资后一次性打包发你。
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tag="账号矩阵" title="同名同头像，认准这一个" desc="任何平台看到同名账号，都是同一个源头。官网是所有平台的官方锚点。" />
          <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">平台</th>
                  <th className="px-4 py-3 font-semibold">账号</th>
                  <th className="px-4 py-3 font-semibold">内容侧重</th>
                  <th className="px-4 py-3 font-semibold">更新</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNTS.map((a) => (
                  <tr key={a.platform} className="border-t">
                    <td className="px-4 py-3 font-medium">{a.platform}</td>
                    <td className="px-4 py-3">{a.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.focus}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="default">
              <Link href="/wechat">
                加企微，进对应身份的社群 <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/insights">
                看深度方法长文 <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LeadSection
        title="把内容里讲的东西，变成你能用的文件"
        desc="留资即得：SOP 清单 PDF、表格模板、报告摘要。"
      />
    </>
  );
}
