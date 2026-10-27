# 第 6 步 · 第三方跳转与 UTM 追踪

---

## 1. 设计原则

**公域 → 官网/私域 → 第三方成交**，官网是所有成交的前置节点。
所以：**任何站外链接点击前，都先过一次留资提示**，但不把人堵死。

---

## 2. 拦截组件 `ThirdPartyGate`

**文件**：`components/site/third-party-gate.tsx`

点击第三方链接 → 弹窗：

```
┌────────────────────────────────────────┐
│  加微信领取完整资料 / 优惠链接              │
│                                        │
│  [ 加企业微信（推荐）]  ← 主按钮，去 /wechat  │
│  [ 填表留资 ]          ← 去 /contact       │
│  ─────────────────────────────────    │
│  已经加过了？继续前往第三方 →   ← 始终保留    │
└────────────────────────────────────────┘
```

三个出口全部埋点，放行时链接自动带 UTM。

### 使用方式

```tsx
// 产品卡里的购买按钮（ProductCta 已内置）
<ThirdPartyGate open={open} onOpenChange={setOpen}
  url={product.third_party_url}
  title={`购买「${product.name}」`}
  platform={product.third_party_platform}
  demand={demand} />

// 非产品场景的站外链接（平台入口表、账号矩阵）
<ExternalLink href="https://xxx" label="小鹅通" platform="小鹅通" demand="课程" />
```

> **约定**：站内不允许裸 `<a href="https://...">` 指向第三方平台，一律走上面两个组件。

---

## 3. UTM 规范

### 3.1 出站（官网 → 第三方）

`lib/utm.ts` 的 `withUtm(url, campaign, medium)`：

```
utm_source=website              ← 官网是来源
utm_medium=product | gate | link ← 位置：产品卡 / 拦截弹窗 / 其他
utm_campaign=<产品slug 或 需求名>  ← 具体是哪个产品带来的
```

示例：`https://xiaoe.com/xxx?utm_source=website&utm_medium=product&utm_campaign=toolkit-selection`

### 3.2 入站（公域 → 官网）

给各平台发链接时自己带上，例如抖音主页挂：
`https://yourdomain.com/?utm_source=douyin&utm_medium=social&utm_campaign=bio`

落地时 `UtmCapture` 捕获 `utm_*` + `referrer` + 落地页 URL，写入 localStorage（**首触归因**：后续访问沿用最初来源）。

### 3.3 来源渠道自动归类

`inferChannel()` 判定优先级：`utm_source` 字典 → `referrer` 域名规则 → 直接访问。

| channel | 判定来源 |
|---|---|
| `douyin` 抖音 | `douyin.com` / `iesdouyin.com` / utm_source=douyin |
| `channels` 视频号 | `weixin.qq.com` / `channels.weixin` |
| `zhihu` 知乎 | `zhihu.com` / `zhimg.com` |
| `wechat_mp` 公众号 | `mp.weixin.qq.com` |
| `bilibili` B站 | `bilibili.com` / `b23.tv` |
| `search` 搜索 | baidu / google / bing / sogou / so.com / 360 |
| `direct` 直接访问 | 无 utm 且无 referrer |
| `other` 其他 | 有来源但认不出 |

结果写入 `leads.channel`，邮件与飞书通知标题都带渠道名（如「【新线索·抖音】」）。

---

## 4. 事件追踪 `lib/analytics.ts`

一次调用，三路发送：

```ts
trackEvent("wechat_click", { from: "floating", page: "/products" });
// 1) GA4: window.gtag("event", name, props)
// 2) Plausible: window.plausible(name, { props })
// 3) 自建库: sendBeacon → POST /api/track → Supabase events 表
```

### 事件清单

| 事件 | 触发点 |
|---|---|
| `form_submit` | 留资表单提交成功 |
| `wechat_click` | 点击加企微 / 复制微信号（浮动条、拦截弹窗、加微页） |
| `third_party_click` | 第三方跳转（`props.stage`：`intent` 点按钮 / `go` 真跳） |
| `asset_download` | 免费资料领取 |
| `consult_click` | 预约咨询 |
| `ai_chat_open` / `ladder_click` | AI 问答打开 / 产品阶梯点击 |

### 站内链接埋点组件

```tsx
<TrackedLink href="/contact?intent=asset" event="asset_download" data={{ from: "home" }}>
  领取资料
</TrackedLink>
```

### 服务端校验 `app/api/track/route.ts`

事件名**白名单校验**，非法名返回 422（防刷）。幂等写入 `events` 表。

---

## 5. 分析平台接入

`.env.local` 里配任意一个即可（都不配则不注入任何脚本，零开销）：

```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io   # 自建实例改这里
```

**Plausible 需要建 goal**：后台 Goals → 添加自定义事件，事件名与上表完全一致。
**GA4**：管理 → 事件，自定义维度里加 `channel` / `product` 可看更细。

---

## 6. 埋点自检

```bash
# 合法事件 → 200
curl -X POST http://localhost:3111/api/track -H 'Content-Type: application/json' \
  -d '{"event":"wechat_click","props":{"from":"test"},"path":"/","channel":"douyin"}'

# 非法事件名 → 422
curl -o /dev/null -w '%{http_code}' -X POST http://localhost:3111/api/track \
  -H 'Content-Type: application/json' -d '{"event":"hack"}'
```

页面自检：
- [ ] 任意产品卡点「去小鹅通购买」→ 弹窗出现，三个出口都能点
- [ ] 点「继续前往」→ 新窗口 URL 带 `utm_source=website`
- [ ] `/wechat` 的平台入口表点任意一项 → 同样弹窗
- [ ] GA4/Plausible 实时面板能看到事件（配了的话）
- [ ] `/admin` 看板事件漏斗有数
