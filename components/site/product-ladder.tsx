import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductIcon } from "./icon";
import { ProductCta } from "./product-cta";
import {
  TIERS, TIER_ORDER, LAYER_LABELS, LAYER_ORDER,
  type Product, type Tier, type Layer,
} from "@/lib/types";

const TIER_STYLE: Record<Tier, { bar: string; soft: string; text: string }> = {
  free: { bar: "bg-secondary", soft: "bg-secondary/50", text: "text-primary" },
  toolkit: { bar: "bg-brand-orange", soft: "bg-brand-orange-soft", text: "text-accent-foreground" },
  course: { bar: "bg-brand-green", soft: "bg-brand-green-soft", text: "text-brand-green" },
  enterprise: { bar: "bg-brand-red", soft: "bg-brand-red-soft", text: "text-brand-red" },
};

/** 四层各自的价格带（用于 groupBy="layer" 时展示） */
const LAYER_RANGE: Record<Layer, string> = {
  traffic: "¥0 · 免费",
  trust: "¥0 – 低门槛",
  conversion: "¥199 – ¥4,999",
  delivery: "¥20,000 起",
};

type GroupBy = "tier" | "layer";

/**
 * 产品阶梯 / 产品分层
 * - groupBy="tier" ：按价格档分四档（免费 → 工具包 → 课程订阅 → 咨询内训）
 * - groupBy="layer"：按信任层级分四层（流量层 → 信任层 → 转化层 → 交付层）
 * 两种分组都回答：这一档解决什么、有什么产品、下一步动作。
 */
export function ProductLadder({
  products,
  showProducts = true,
  showFooter = true,
  groupBy = "tier",
  limitPerRow,
}: {
  products: Product[];
  showProducts?: boolean;
  showFooter?: boolean;
  groupBy?: GroupBy;
  /** 每层/每档最多展示几张卡，超出部分引导去产品中心 */
  limitPerRow?: number;
}) {
  const isLayer = groupBy === "layer";
  const keys = (isLayer ? LAYER_ORDER : TIER_ORDER) as readonly string[];

  return (
    <div className="space-y-4">
      {keys.map((key, i) => {
        const style = TIER_STYLE[TIER_ORDER[i]];
        const title = isLayer ? LAYER_LABELS[key as Layer].name : TIERS[key as Tier].name;
        const lead = isLayer ? LAYER_LABELS[key as Layer].desc : TIERS[key as Tier].range;
        const goal = isLayer ? LAYER_LABELS[key as Layer].goal : TIERS[key as Tier].goal;
        const note = isLayer ? LAYER_RANGE[key as Layer] : TIERS[key as Tier].note;

        const all = products.filter((p) =>
          isLayer ? p.layer === key : p.tier === key
        );
        const items = limitPerRow ? all.slice(0, limitPerRow) : all;
        if (all.length === 0) return null;

        return (
          <Card key={key} className="overflow-hidden">
            <div className={`h-1.5 w-full ${style.bar}`} />
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${style.soft} ${style.text}`}
                >
                  {isLayer ? `第 ${i + 1} 层` : `第 ${i + 1} 档`} · {title}
                </span>
                <span className="text-lg font-bold md:text-xl">{lead}</span>
                <span className="ml-auto text-xs text-muted-foreground">目标：{goal}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {isLayer ? `价格带 ${note}` : note}
              </p>

              {showProducts && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col gap-2 rounded-xl border bg-card p-4"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.soft} ${style.text}`}
                        >
                          <ProductIcon name={p.icon} className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${p.slug}`}
                            className="block text-sm font-bold leading-snug underline-offset-4 hover:underline"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{p.audience}</p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{p.deliverable}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed pt-2.5">
                        <span className={`text-sm font-bold ${style.text}`}>{p.price}</span>
                        <ProductCta product={p} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {limitPerRow && all.length > limitPerRow && (
                <p className="mt-3 text-xs text-muted-foreground">
                  本层共 {all.length} 项，已展示 {items.length} 项 ·{" "}
                  <Link href="/products" className="text-primary underline-offset-2 hover:underline">
                    查看全部
                  </Link>
                </p>
              )}

              {i < keys.length - 1 && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                  用得上、想更进一步，再往上走一层
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {showFooter && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="flex items-start gap-2 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <span>
              不确定从哪一档开始？<b>先领免费的</b>——清单和模板能直接照着做，
              用得上再考虑工具包，别一上来就买课。
            </span>
          </p>
          <Link
            href="/contact?intent=asset"
            className="shrink-0 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white"
          >
            先领免费资料
          </Link>
        </div>
      )}
    </div>
  );
}

/** 紧凑版阶梯条：用于产品中心页顶部导航 */
export function LadderNav({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TIER_ORDER.map((tier, i) => {
        const t = TIERS[tier];
        const count = products.filter((p) => p.tier === tier).length;
        const style = TIER_STYLE[tier];
        return (
          <a
            key={tier}
            href={`#tier-${tier}`}
            className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-warm"
          >
            <Badge variant="outline" className={`${style.soft} ${style.text} border-transparent`}>
              第 {i + 1} 档
            </Badge>
            <p className="mt-2 text-sm font-bold">{t.name}</p>
            <p className={`text-lg font-bold ${style.text}`}>{t.range}</p>
            <p className="mt-1 text-xs text-muted-foreground">{count} 项 · {t.goal}</p>
          </a>
        );
      })}
    </div>
  );
}
