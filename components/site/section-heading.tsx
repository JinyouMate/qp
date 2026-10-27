import { cn } from "@/lib/utils";

export function SectionHeading({
  tag,
  title,
  desc,
  className,
}: {
  tag?: string;
  title: string;
  desc?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto mb-10 max-w-2xl text-center", className)}>
      {tag && (
        <span className="mb-2 block text-xs font-semibold tracking-[0.25em] text-accent-foreground">
          {tag}
        </span>
      )}
      <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
      {desc && <p className="mt-3 text-sm text-muted-foreground md:text-[15px]">{desc}</p>}
    </div>
  );
}
