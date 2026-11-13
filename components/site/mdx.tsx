import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * MDX 组件映射：把 Markdown 元素套上站内样式。
 * 样式主体在 globals.css 的 .mdx-body 下，这里只处理需要组件化的部分（链接）。
 */
const A = ({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) => {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
};

/**
 * 表格：外层包一个可横向滚动的容器。
 * MDX 里的 GFM 表格在 375px 下会被压到看不清，包一层后窄屏可左右滑，页面本身不溢出。
 */
const Table = ({ children, ...rest }: ComponentPropsWithoutRef<"table">) => (
  <div className="table-scroll">
    <table {...rest}>{children}</table>
  </div>
);

export const mdxComponents = {
  a: A,
  table: Table,
};
