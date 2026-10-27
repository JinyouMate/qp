"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getStoredUtm } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

const ROLES = ["修理厂", "汽配商", "平台企业", "AI公司", "其他"] as const;
const DEMANDS = ["知识库", "数据产品", "SOP", "报告", "课程", "咨询", "SaaS", "AI合作"] as const;

const schema = z.object({
  name: z.string().min(1, "请填写姓名"),
  contact: z.string().min(1, "请留下微信、手机或邮箱"),
  role: z.string().min(1, "请选择你的身份"),
  demand: z.string().min(1, "请选择需求方向"),
  description: z.string().optional(),
  consent: z.boolean().refine((v) => v, "请先勾选同意《隐私政策》"),
  /** 蜜罐：真人看不到，机器人会填 */
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LeadForm({
  variant = "full",
  defaultRole,
  defaultDemand,
}: {
  variant?: "compact" | "full";
  defaultRole?: string;
  defaultDemand?: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contact: "",
      role: defaultRole && ROLES.includes(defaultRole as (typeof ROLES)[number]) ? defaultRole : "",
      demand:
        defaultDemand && DEMANDS.includes(defaultDemand as (typeof DEMANDS)[number])
          ? defaultDemand
          : "",
      description: "",
      consent: false,
      website: "",
    },
  });

  const role = watch("role");
  const demand = watch("demand");
  const consent = watch("consent");

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      const stored = getStoredUtm();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          utm: stored,
          channel: stored.channel ?? "direct",
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (!res.ok) throw new Error("提交失败，请稍后再试");

      // 事件埋点：表单提交（GA4 / Plausible / 自建 events 表）
      trackEvent("form_submit", {
        role: values.role,
        demand: values.demand,
        channel: stored.channel ?? "direct",
        has_description: Boolean(values.description?.trim()),
        variant,
      });

      setDone(true);
      // 提交后跳转到「加微信领资料」页面
      setTimeout(() => router.push("/wechat?from=contact"), 1400);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "提交失败，请稍后再试");
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-brand-green" strokeWidth={1.5} />
        <h3 className="text-xl font-bold">提交成功！</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          正在跳转…加微信后回复
          <span className="mx-1 rounded bg-brand-orange-soft px-2 py-0.5 font-semibold text-accent-foreground">
            【汽配数据】
          </span>
          领取资料。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lf-name">姓名 *</Label>
          <Input id="lf-name" placeholder="怎么称呼你" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lf-contact">微信 / 手机 / 邮箱 *</Label>
          <Input id="lf-contact" placeholder="方便联系到你的方式" {...register("contact")} />
          {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>你的身份 *</Label>
          <Select value={role} onValueChange={(v) => setValue("role", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="请选择…" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>你的需求 *</Label>
          <Select value={demand} onValueChange={(v) => setValue("demand", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="请选择…" />
            </SelectTrigger>
            <SelectContent>
              {DEMANDS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.demand && <p className="text-xs text-destructive">{errors.demand.message}</p>}
        </div>
      </div>

      {variant === "full" && (
        <div className="space-y-1.5">
          <Label htmlFor="lf-desc">具体问题描述</Label>
          <Textarea
            id="lf-desc"
            placeholder="例如：我们在 Ozon 卖刹车片，毛利率一直上不去，想做个诊断"
            {...register("description")}
          />
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="lf-consent"
          checked={consent}
          onCheckedChange={(v) => setValue("consent", v === true, { shouldValidate: true })}
        />
        <Label htmlFor="lf-consent" className="text-xs leading-relaxed font-normal text-muted-foreground">
          我已阅读并同意
          <Link href="/privacy" target="_blank" className="mx-1 text-primary underline-offset-2 hover:underline">
            《隐私政策》
          </Link>
          ，同意将以上信息用于资料发送与业务联系，我知道可以随时要求删除。
        </Label>
      </div>
      {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}

      {/* 蜜罐字段：对真人不可见，机器人会填值，服务端据此静默丢弃 */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lf-website"> website </label>
        <input
          id="lf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        将自动附带来源渠道信息（仅用于统计哪个渠道的内容对你有用）。
        <br />
        联系方式填<strong className="font-semibold">手机号或邮箱</strong>，
        购买链接与配套资料会发到这个联系方式上。
      </p>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        {variant === "full" ? "提交，领取资料" : "领取资料 + 获取社群邀请"}
      </Button>
    </form>
  );
}
