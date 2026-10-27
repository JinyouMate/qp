"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Gift, ArrowRight } from "lucide-react";

/** 从表单提交 / 第三方拦截弹窗过来时的落地提示条 */
export function WechatBanner() {
  const sp = useSearchParams();
  const from = sp.get("from");

  if (from !== "contact" && from !== "gate") return null;

  const fromContact = from === "contact";

  return (
    <section className="border-b bg-brand-green text-white">
      <div className="container-site py-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            {fromContact ? (
              <CheckCircle2 className="h-6 w-6 text-brand-orange" />
            ) : (
              <Gift className="h-6 w-6 text-brand-orange" />
            )}
          </span>
          <div className="flex-1">
            <p className="text-lg font-bold">
              {fromContact ? "提交成功，最后一步：加微信" : "资料与优惠链接都在微信这边"}
            </p>
            <p className="mt-1 text-sm text-white/85">
              扫码添加企微（备注「官网」优先通过），发送
              <span className="mx-1 rounded bg-white/20 px-2 py-0.5 font-semibold">汽配数据</span>
              四个字即可领取。
            </p>
          </div>
          <a
            href="#qrcode"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
          >
            看二维码 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
