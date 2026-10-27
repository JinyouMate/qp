import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductIcon } from "./icon";
import { ProductCta } from "./product-cta";
import { PlanetNote } from "./planet-note";
import { LAYER_LABELS, TIERS, type Product } from "@/lib/types";

const LAYER_BADGE: Record<string, string> = {
  traffic: "secondary",
  trust: "default",
  conversion: "accent",
  delivery: "destructive",
};

/** 产品卡：必须回答五个问题——适合谁 / 解决什么 / 交付什么 / 怎么收费 / 下一步动作 */
export function ProductCard({ product }: { product: Product }) {
  const fields = [
    { label: "解决什么", value: product.problem },
    { label: "适合谁", value: product.audience },
    { label: "交付什么", value: product.deliverable },
  ];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <ProductIcon name={product.icon} />
          </span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Badge variant="outline">{TIERS[product.tier].name}</Badge>
            <Badge variant={LAYER_BADGE[product.layer] as never}>
              {LAYER_LABELS[product.layer].name}
            </Badge>
          </div>
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
          {product.cta_type === "buy" && (
            <PlanetNote platform={product.third_party_platform} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
