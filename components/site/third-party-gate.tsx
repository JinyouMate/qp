"use client";

import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { withUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

/**
 * 第三方跳转前的轻量留资提示。
 * 原则：所有站外成交/交付链接，都必须先给一次「加微信领取完整资料/优惠链接」的机会，
 * 但仍然留一个「继续前往」的出口——不把人堵死。
 */
export function ThirdPartyGate({
  open,
  onOpenChange,
  url,
  title,
  platform,
  demand,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  url: string | null;
  title: string;
  platform?: string | null;
  demand?: string;
}) {
  const target = url ? withUtm(url, demand ?? "third_party", "gate") : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>加微信领取完整资料 / 优惠链接</DialogTitle>
          <DialogDescription>
            {title}
            {platform ? ` 在「${platform}」上交付。` : ""}
            {" "}加企微后回复
            <span className="mx-1 rounded bg-brand-orange-soft px-1.5 py-0.5 font-semibold text-accent-foreground">
              【汽配数据】
            </span>
            直接拿资料与优惠，还能进对应身份的社群。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          <Button
            asChild
            variant="default"
            onClick={() => {
              trackEvent("wechat_click", { from: "gate", platform: platform ?? "", demand: demand ?? "" });
              onOpenChange(false);
            }}
          >
            <Link href="/wechat?from=gate">
              <MessageCircle /> 加企业微信（推荐）
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
            <Link href={`/contact?intent=buy${demand ? `&demand=${encodeURIComponent(demand)}` : ""}`}>
              填表留资，资料发我邮箱/微信
            </Link>
          </Button>
        </div>

        <DialogFooter className="sm:justify-center">
          {target ? (
            <a
              href={target}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("third_party_click", {
                  platform: platform ?? "",
                  campaign: demand ?? "",
                  url: target,
                });
                onOpenChange(false);
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              已加过微信，继续前往{platform ? ` ${platform}` : ""} <ArrowUpRight className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">
              {platform ? `${platform} 链接上线后此处直达` : "链接配置后此处直达"}
              （配置于数据库 products.third_party_url）
            </span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
