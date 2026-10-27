#!/usr/bin/env python3
"""批量生成 OG 图（1200x630 PNG）。

用法：
    python scripts/gen-og.py

- 输出到 public/og/<name>.png
- 品牌名 / 域名 / 配色集中在下方常量，改完重跑即可
- 文章页 OG 自动从 content/insights/*.mdx 的 frontmatter 读取
"""
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
CONTENT = ROOT / "content" / "insights"

# ---------- 品牌常量（改这里，全站 OG 同步） ----------
BRAND = "汽配知识局"
SLOGAN = "汽配行业知识资产运营商"
DOMAIN = "qipeizhishi.com"
GREEN = (31, 111, 74)       # #1F6F4A
RED = (196, 69, 54)         # #C44536
ORANGE = (224, 122, 63)     # #E07A3F
CREAM = (247, 244, 239)     # #F7F4EF
INK = (42, 38, 33)
MUTED = (120, 111, 99)
W, H = 1200, 630

# ---------- 字体 ----------
CANDIDATES = [
    ("/System/Library/Fonts/PingFang.ttc", 4),   # Semibold
    ("/System/Library/Fonts/PingFang.ttc", 8),   # Medium
    ("/System/Library/Fonts/STHeiti Medium.ttc", 0),
    ("/System/Library/Fonts/STHeiti Light.ttc", 0),
    ("/System/Library/Fonts/Hiragino Sans GB.ttc", 0),
    ("/Library/Fonts/Arial Unicode.ttf", 0),
]
FONT_PATH = None
FONT_INDEX = 0
for p, idx in CANDIDATES:
    if Path(p).exists():
        FONT_PATH, FONT_INDEX = p, idx
        break
if FONT_PATH is None:
    raise SystemExit("未找到可用中文字体，请手动指定 FONT_PATH")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size, index=FONT_INDEX)


# ---------- 文本换行 ----------
def wrap(text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines, cur = [], ""
    for ch in text:
        if ch == "\n":
            lines.append(cur)
            cur = ""
            continue
        trial = cur + ch
        if f.getlength(trial) > max_w and cur:
            lines.append(cur)
            cur = ch
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines


def draw_og(path: Path, title: str, desc: str, tag: str = "") -> None:
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    # 顶部绿条
    d.rectangle([0, 0, W, 10], fill=GREEN)
    # 底部装饰（橙 + 砖红斜块）
    d.polygon([(W - 320, H), (W, H - 190), (W, H)], fill=ORANGE)
    d.polygon([(W - 200, H), (W, H - 110), (W, H)], fill=RED)
    # 左侧竖条
    d.rectangle([60, 150, 66, 470], fill=GREEN)

    # 品牌行
    f_brand = font(34)
    f_tag = font(26)
    f_title = font(64)
    f_desc = font(30)
    f_foot = font(24)

    d.text((90, 92), BRAND, font=f_brand, fill=GREEN)
    bx = 90 + f_brand.getlength(BRAND) + 18
    if tag:
        tw = f_tag.getlength(tag) + 28
        d.rounded_rectangle([bx, 92, bx + tw, 92 + 46], radius=23, fill=GREEN)
        d.text((bx + 14, 100), tag, font=f_tag, fill=(255, 255, 255))
    d.text((90, 140), SLOGAN, font=f_foot, fill=MUTED)

    # 标题（最多 3 行）
    lines = wrap(title, f_title, W - 240)[:3]
    y = 200
    for ln in lines:
        d.text((90, y), ln, font=f_title, fill=INK)
        y += 82

    # 描述（最多 3 行）
    dy = max(y + 12, 380)
    for ln in wrap(desc, f_desc, W - 260)[:3]:
        d.text((90, dy), ln, font=f_desc, fill=MUTED)
        dy += 46

    # 页脚
    d.text((90, H - 66), DOMAIN, font=f_foot, fill=GREEN)
    d.text((90, H - 34), "从数据到决策，从知识到工具", font=f_foot, fill=MUTED)

    OUT.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)


# ---------- 页面清单 ----------
PAGES = [
    ("default", "把隐性知识变成可交易资产", "汽配数据 · OE号匹配 · VIN解析 · 新能源汽配 · 汽配知识库 · 汽配SOP · 出海数据合规 · AI数据标注", ""),
    ("products", "产品中心：从免费到定制，一次只上一档", "免费内容 → 99-499 工具包 → 999-4999 课程订阅 → 1万+ 咨询内训。每张卡片写清适合谁、解决什么、交付什么、怎么收费。", "产品中心"),
    ("knowledge", "汽配知识库与 SOP", "12,000+ 条目的名词库、适配库、政策库、避坑库，加 6 套可打印照做的 SOP 清单与表格模板。", "知识库"),
    ("courses", "培训课程：把散的干货排成顺序", "录播 + 社群答疑 + 作业批改。选品、适配数据、跨境平台运营，讲方法也讲真实数据。", "课程"),
    ("reports", "行业报告与订阅数据产品", "品类数据、价格带、竞争格局、趋势预判；价格监测、跨平台销量追踪、竞品动态周报，支持 7 天试用。", "报告数据"),
    ("consulting", "咨询方案与企业内训", "诊断 + 方案 + 陪跑，先做 30 分钟免费诊断。面向团队的定制内训，按你的业务讲，不讲通用教材。", "咨询内训"),
    ("partners", "SaaS 与 AI 数据合作", "面向 SaaS 的行业 Know-how 与种子用户合作；面向 AI 公司的汽配语料授权、标注规则与评测标准共建。", "生态合作"),
    ("content", "内容 IP：全网同名「汽配知识局」", "短视频拆解选品与避坑，深度图文讲数据与方法，月度直播讲透一个流程。", "内容IP"),
    ("cases", "真实案例与结果数据", "修理厂采购梳理、从业者选品与毛利修正、平台企业与 AI 公司的数据合作。每个案例附口径说明。", "客户案例"),
    ("about", "关于我们：不卖货，只做知识资产", "汽配行业知识资产运营商。不卖货、不代运营、不碰交易。把隐性知识变成可交易资产。", "关于"),
    ("contact", "联系与留资：说清你的问题", "留下身份与需求，我们按你的情况推荐最合适的一两样产品，不群发、不推销。", "留资"),
    ("wechat", "加企微领资料，进同行社群", "加微信后回复【汽配数据】，领取资料包；知识库、课程、数据看板的入口统一在这里开通。", "私域"),
    ("privacy", "隐私政策", "我们收集什么、为什么收集、保存多久、你怎么删除，以及 Cookie 与第三方平台说明。", "合规"),
    ("terms", "服务条款", "服务范围、官网与第三方平台的责任边界、版权与内容授权、数据合规、免责与争议解决。", "合规"),
    ("insights", "汽配行业洞察", "OE 号匹配、VIN 解析、新能源汽配、出海数据合规、AI 数据标注的实操方法与行业观察。", "内容库"),
]

# 文章页：从 MDX frontmatter 读取
def article_ogs() -> list[tuple[str, str, str, str]]:
    out = []
    if not CONTENT.exists():
        return out
    for f in sorted(CONTENT.glob("*.mdx")):
        raw = f.read_text(encoding="utf-8")
        m = re.search(r"^---\n(.*?)\n---", raw, re.DOTALL)
        if not m:
            continue
        fm = m.group(1)
        # frontmatter 里可能带引号也可能不带，两种都支持
        t = re.search(r'^title:\s*"?(?P<v>.+?)"?\s*$', fm, re.MULTILINE)
        d = re.search(r'^description:\s*"?(?P<v>.+?)"?\s*$', fm, re.MULTILINE)
        if not t:
            continue
        out.append((f"insights-{f.stem}", t.group("v"), d.group("v") if d else "", "汽配洞察"))
    return out


# 产品详情页：从 lib/data.ts 解析 slug / name / positioning / price
DATA = ROOT / "lib" / "data.ts"


def product_ogs() -> list[tuple[str, str, str, str]]:
    out = []
    if not DATA.exists():
        return out
    raw = DATA.read_text(encoding="utf-8")
    pat = re.compile(
        r'slug:\s*"(?P<slug>[^"]+)",\s*name:\s*"(?P<name>[^"]+)".*?'
        r'positioning:\s*\n?\s*"(?P<pos>[^"]+)".*?'
        r'price:\s*\n?\s*"(?P<price>[^"]+)"',
        re.DOTALL,
    )
    for m in pat.finditer(raw):
        out.append(
            (
                f"products-{m.group('slug')}",
                m.group("name"),
                f'{m.group("pos")} · {m.group("price")}',
                "产品",
            )
        )
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    all_pages = PAGES + article_ogs() + product_ogs()
    for name, title, desc, tag in all_pages:
        draw_og(OUT / f"{name}.png", title, desc, tag)
        print(f"ok  og/{name}.png")
    print(f"\n共生成 {len(all_pages)} 张 OG 图 → public/og/")


if __name__ == "__main__":
    main()
