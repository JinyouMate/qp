"""生成「底层数据资产看板」三张占位图表（品牌色，字号按小卡片展示优化）。

真实数据出来后，直接用同名文件覆盖 public/data/ 下三张 PNG 即可，无需改代码。
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

FONT = "/System/Library/Fonts/PingFang.ttc"
fp = fm.FontProperties(fname=FONT)
plt.rcParams["font.family"] = fp.get_name()
plt.rcParams["axes.unicode_minus"] = False

GREEN = "#1F6F4A"
ORANGE = "#E07A3F"
INK = "#102A20"
MUTED = "#7C8B84"
GRID = "#E6EBE8"

OUT = "/Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web/public/data"

# 卡片实际展示宽度约 340px，图幅按 6x3.75 英寸出图、字号放大，缩到小卡仍可辨认
fig_kw = dict(figsize=(6, 3.75), dpi=260)


def style(ax, title=None):
    # 图内不再画标题：卡片已有 h3 标题，重复会显得啰嗦，也挤占绘图区
    ax.set_facecolor("white")
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color("#D9E0DC")
    ax.tick_params(axis="both", colors=MUTED, labelsize=12.5, length=0, pad=5)
    ax.grid(axis="y", color=GRID, linewidth=1)
    ax.set_axisbelow(True)


# ---------- 1. 月度 SKU 与供应商趋势 ----------
months = [f"{i}月" for i in range(1, 12)]
sku = np.array([128, 146, 165, 183, 201, 219, 238, 256, 274, 295, 312])  # 万条
sup = np.array([612, 648, 690, 731, 768, 806, 842, 871, 895, 915, 931])  # 家

fig, ax = plt.subplots(**fig_kw)
style(ax, "月度 SKU 与供应商趋势")
x = np.arange(len(months))
ax.plot(x, sku, color=GREEN, linewidth=3, marker="o", markersize=5.5,
        markerfacecolor="white", markeredgewidth=2.2, markeredgecolor=GREEN, zorder=3)
# 用图例替代散点标注：小卡片上更清爽，也避免与刻度打架
line1, = ax.plot([], [], color=GREEN, linewidth=3, marker="o", markersize=5.5,
                 markerfacecolor="white", markeredgewidth=2.2)
line2, = ax.plot([], [], color=ORANGE, linewidth=2, linestyle=(0, (4, 3)))
ax.legend([line1, line2], ["SKU 累计（万条）", "在营供应商（家）"],
          loc="upper left", frameon=False, fontsize=11.5, handlelength=2.2,
          labelcolor=MUTED, borderaxespad=0.2, labelspacing=0.5)
ax.set_xticks(x, months)
ax.set_ylim(80, 350)
ax.set_yticks([100, 200, 300])
ax.tick_params(axis="x", labelsize=11)

ax2 = ax.twinx()
ax2.plot(x, sup, color=ORANGE, linewidth=2, linestyle=(0, (4, 3)), zorder=2)
ax2.set_ylim(500, 1000)
ax2.set_yticks([600, 800])
ax2.tick_params(axis="y", colors=ORANGE, labelsize=12, length=0, pad=5)
for sp in ("top", "right", "left"):
    ax2.spines[sp].set_visible(False)
ax2.spines["bottom"].set_visible(False)

fig.tight_layout(rect=(0, 0.0, 1, 1.0))
fig.subplots_adjust(left=0.075, right=0.915)
fig.savefig(f"{OUT}/chart-monthly-sku.png", facecolor="white")
plt.close(fig)

# ---------- 2. Top 15 主流品牌覆盖 ----------
brands = ["MEKEDE", "TOYOTA", "BOSCH", "DENSO", "NGK", "VALEO", "MANN",
          "SKF", "ATE", "KYB", "SACHS", "MAHLE", "HENGST", "TRW", "LEMFÖRDER"]
vals = [268, 251, 226, 214, 192, 178, 166, 152, 138, 121, 104, 92, 76, 58, 43]  # 千条

fig, ax = plt.subplots(**fig_kw)
style(ax, "Top 15 主流品牌覆盖")
y = np.arange(len(brands))[::-1]
bars = ax.barh(y, vals, height=0.52, color=GREEN, alpha=0.20,
               edgecolor=GREEN, linewidth=1.0)
bars[0].set_facecolor(ORANGE)
bars[0].set_alpha(0.9)
bars[0].set_edgecolor(ORANGE)
ax.set_yticks(y, brands)
ax.tick_params(axis="y", labelsize=11.5)
ax.set_xlim(0, 300)
ax.set_xticks([0, 100, 200, 300])
ax.set_xlabel("SKU 覆盖量（千条）", fontsize=12, color=MUTED, labelpad=6)
for i, (yy, v) in enumerate(zip(y, vals)):
    if i > 2:  # 小卡片上只标前三名，避免数字挤压
        continue
    ax.text(v - 8, yy, f"{v}", va="center", ha="right", fontsize=10.5,
            color="white" if i == 0 else "#3F6B58", fontweight="bold")
ax.grid(axis="y", visible=False)
ax.grid(axis="x", color=GRID, linewidth=1)
fig.tight_layout(rect=(0, 0.0, 1, 1.0))
fig.savefig(f"{OUT}/chart-top-brands.png", facecolor="white")
plt.close(fig)

# ---------- 3. 黄金毛利区间分布 ----------
bins = ["<20%", "20–30%", "30–40%", "40–50%", "50–60%", ">60%"]
cnt = np.array([62, 148, 372, 486, 348, 202])  # 千条，合计约 161.8 万
share = cnt / cnt.sum() * 100

fig, ax = plt.subplots(**fig_kw)
style(ax, "黄金毛利区间分布")
x = np.arange(len(bins))
for xi, v, b in zip(x, cnt, bins):
    hit = b == "40–50%"
    c = ORANGE if hit else GREEN
    ax.bar(xi, v, width=0.62, color=c, alpha=0.9 if hit else 0.20,
           edgecolor=c, linewidth=1.3)
    ax.text(xi, v + 12, f"{v}", ha="center", fontsize=11,
            color=ORANGE if hit else MUTED,
            fontweight="bold" if hit else "normal")
ax.text(x[3], cnt[3] / 2, f"{share[3]:.0f}%", ha="center", va="center",
        fontsize=15, color="white", fontweight="bold")
ax.set_xticks(x, bins)
ax.tick_params(axis="x", labelsize=11)
ax.set_ylim(0, 560)
ax.set_yticks([0, 200, 400])
ax.set_ylabel("商品数（千条）", fontsize=12, color=MUTED, labelpad=6)
ax.axhline(0, color="#D9E0DC", linewidth=1)
fig.tight_layout(rect=(0, 0.0, 1, 1.0))
fig.savefig(f"{OUT}/chart-margin-distribution.png", facecolor="white")
plt.close(fig)

print("done")
