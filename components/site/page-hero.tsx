import { cn } from "@/lib/utils";

/** 二级页面统一页头 */
export function PageHero({
  tag,
  title,
  desc,
  children,
  className,
}: {
  tag?: string;
  title: string;
  desc?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b bg-gradient-to-b from-brand-green-soft to-background", className)}>
      <div className="container-site py-12 md:py-16">
        {tag && (
          <span className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.2em] text-brand-orange">
            {tag}
          </span>
        )}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
        {desc && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {desc}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
