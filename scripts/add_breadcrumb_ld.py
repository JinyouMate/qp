#!/usr/bin/env python3
"""给指定页面插入 BreadcrumbList 结构化数据。"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGES = {
    "knowledge": "知识库与SOP",
    "reports": "报告与数据产品",
    "consulting": "咨询与内训",
    "partners": "SaaS与AI合作",
    "content": "内容IP",
    "cases": "案例",
    "contact": "联系与留资",
    "about": "关于我们",
}

IMPORT_LINE = 'import { JsonLd, breadcrumbSchema } from "@/components/site/json-ld";'
ANCHOR = "import { buildMetadata, KEYWORDS } from \"@/lib/seo\";"

for name, title in PAGES.items():
    f = ROOT / "app" / name / "page.tsx"
    src = f.read_text(encoding="utf-8")

    if "breadcrumbSchema" in src:
        print(f"-- 跳过 {name}（已存在）")
        continue

    # 1) 加 import
    if ANCHOR in src:
        src = src.replace(ANCHOR, ANCHOR + "\n" + IMPORT_LINE, 1)
    else:
        src = src.replace(
            'import type { Metadata } from "next";',
            'import type { Metadata } from "next";\n' + IMPORT_LINE,
            1,
        )

    # 2) 在首个 JSX 片段开头插入 JsonLd
    marker = "  return (\n    <>\n"
    if marker not in src:
        print(f"!! 跳过 {name}（未找到 return 锚点）")
        continue

    block = (
        "      {/* 结构化数据：面包屑 */}\n"
        "      <JsonLd\n"
        "        data={breadcrumbSchema([\n"
        '          { name: "首页", url: "/" },\n'
        f'          {{ name: "{title}", url: "/{name}" }},\n'
        "        ])}\n"
        "      />\n\n"
    )
    src = src.replace(marker, marker + block, 1)
    f.write_text(src, encoding="utf-8")
    print(f"ok  {name}")

print("\n完成")
