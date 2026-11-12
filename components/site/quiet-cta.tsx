import { WecomCtaButton } from "@/components/site/wecom-dialog";

/* ============================================================
   轻量收尾注（QuietCta）

   用途：阅读型页面（内容/洞察/知识库/课程/关于）末尾的一行引导。
   规则：
   - 不做卡片、不用暖色底板、不加二维码，只一行文字 + 文字链接
   - 决策页（首页 / 服务目录 / 产品详情 / 联系我们 / 商务合作）
     仍用 WecomCtaCard 大卡片，其余页面一律用这里
   - 隐私政策、服务条款不放任何转化元素
   ============================================================ */

export function QuietCta({
  text = "有具体的品类或方案想聊？",
  label = "添加主理人企微",
  from = "quiet-cta",
  subject,
  className = "",
}: {
  text?: string;
  label?: string;
  /** 触发位置，用于埋点区分来源 */
  from?: string;
  /** 触发主体（页面名） */
  subject?: string;
  className?: string;
}) {
  return (
    /* lg 以下隐藏：移动端底部已有常驻「联系主理人」固定条，再放这行属重复 */
    <div className={`container-site hidden pb-16 pt-2 text-center lg:block ${className}`}>
      <p className="text-sm text-muted-foreground">
        {text}
        <WecomCtaButton
          variant="link"
          label={label}
          from={from}
          subject={subject}
          className="ml-1 h-auto p-0 text-sm font-medium text-brand-orange-ink underline-offset-4 hover:text-brand-orange hover:underline"
        />
      </p>
    </div>
  );
}
