import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* 火：全站主 CTA 统一阳光橙，白字，hover 加深到 orange-700 */
        default: "bg-brand-orange text-white shadow-warm hover:bg-brand-orange-dark",
        /* 站内 CTA（预约咨询 / 领取资料）历史上也用 destructive，一并收口到行动色 */
        destructive: "bg-brand-orange text-white shadow-warm hover:bg-brand-orange-dark",
        orange: "bg-brand-orange text-white shadow-warm hover:bg-brand-orange-dark",
        /* 次级按钮：暖橙描边而不是冷绿，保持火系但不与主按钮抢焦点 */
        outline: "border border-brand-orange/35 bg-transparent text-brand-orange-ink hover:border-brand-orange/60 hover:bg-brand-orange-soft",
        /* 木：浅绿辅助标签保留品牌绿 */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-brand-orange-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
