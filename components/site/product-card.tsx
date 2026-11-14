import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductIcon } from "./icon";
import { ProductCta } from "./product-cta";
import { WecomNote } from "./wecom-note";
import { LIBRARIES, type Product } from "@/lib/types";

/** 三库徽标配色：数据库用品牌绿实心，视觉上压过另外两个板块 */
export const LIBRARY_BADGE: Record<string, string> = {
  kb: "bg-secondary text-primary",
  tools: "bg-brand-orange-soft text-brand-orange-ink",
  data: "bg-brand-green text-white",
  custom: "bg-brand-red-soft text-brand-red",
};

/** 产品卡：必须回答五个问题——适合谁 / 解决什么 / 交付什么 / 怎么收费 / 下一步动作 */
export function ProductCard({ product }: { product: Product }) {
  const fields = [
    { label: "解决什么", value: product.problem },
    { label: "适合谁", value: product.audience },
    { label: "交付什么", value: product.deliverable },
  ];
  const lib = LIBRARIES[product.library];

  return (
    <Card className="card-hover flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <ProductIcon name={product.icon} />
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LIBRARY_BADGE[product.library]}`}
          >
            {lib.name}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="pt-2 text-base font-bold underline-offset-4 hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xs leading-relaxed text-muted-foreground">{product.positioning}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <dl className="space-y-2 text-xs">
          {fields.map((f) => (
            <div key={f.label} className="flex gap-2">
              <dt className="shrink-0 font-semibold text-muted-foreground">{f.label}</dt>
              <dd className="text-foreground/85">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto space-y-3 border-t border-dashed pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">怎么收费</span>
            <span className="text-base font-bold text-brand-red">{product.price}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">下一步动作</span>
            <ProductCta product={product} />
          </div>
          {product.cta_type === "buy" && <WecomNote compact />}
        </div>
      </CardContent>
    </Card>
  );
}
