#!/usr/bin/env python3
"""把各页的 metadata 从裸对象改为 buildMetadata（带 canonical / OG / 关键词）。
只跑一次；之后各页 metadata 手工维护即可。"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGES = {
    "products": ("data", "oe", "vin", "knowledge", "sop"),
    "knowledge": ("knowledge", "sop", "data", "oe", "vin"),
    "courses": ("knowledge", "sop", "data", "compliance"),
    "reports": ("data", "nev", "compliance", "oe"),
    "consulting": ("data", "knowledge", "sop", "compliance"),
    "partners": ("ai", "data", "compliance", "oe"),
    "content": ("knowledge", "data", "oe", "vin"),
    "cases": ("data", "oe", "sop", "compliance"),
    "contact": ("knowledge", "data", "sop"),
    "wechat": ("knowledge", "data"),
    "about": ("knowledge", "data", "ai"),
    "privacy": ("compliance",),
    "terms": ("compliance",),
}

META_RE = re.compile(
    r"export const metadata: Metadata = \{\n(?P<body>.*?)\n\};",
    re.DOTALL,
)

for name, keys in PAGES.items():
    f = ROOT / "app" / name / "page.tsx"
    src = f.read_text(encoding="utf-8")

    m = META_RE.search(src)
    if not m:
        print(f"!! 跳过 {name}（未找到 metadata 块）")
        continue

    body = m.group("body")
    t = re.search(r'title:\s*"([^"]+)"', body, re.DOTALL)
    d = re.search(r'description:\s*"(.+?)",', body, re.DOTALL)
    if not t or not d:
        print(f"!! 跳过 {name}（解析 title/description 失败）")
        continue

    title = t.group(1).strip()
    desc = d.group(1).strip().replace("\n", "")
    kws = ", ".join(f"KEYWORDS.{k}" for k in keys)

    new_block = (
        "export const metadata: Metadata = buildMetadata({\n"
        f'  title: "{title}",\n'
        f'  description: "{desc}",\n'
        f'  path: "/{name}",\n'
        f"  keywords: [{kws}],\n"
        "});"
    )

    src = src[: m.start()] + new_block + src[m.end() :]

    if "lib/seo" not in src:
        src = src.replace(
            'import type { Metadata } from "next";',
            'import type { Metadata } from "next";\n\nimport { buildMetadata, KEYWORDS } from "@/lib/seo";',
            1,
        )

    f.write_text(src, encoding="utf-8")
    print(f"ok  {name}")

print("\n全部处理完毕")
