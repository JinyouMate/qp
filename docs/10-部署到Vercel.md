# 第 8 步 · 部署到 Vercel

---

## 阶段一：准备（30 分钟，一次性）

### 1. 代码推到 Git

```bash
cd /Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web
git init                      # 已是仓库则跳过
git add .
git commit -m "feat: 汽配知识局官网 v1"
git remote add origin git@github.com:<你的账号>/qipei-web.git
git push -u origin main
```

> 确认 `.gitignore` 含 `.env*.local`（Next 脚手架默认已有），**`.env.local` 绝不能提交**。

### 2. 建 Supabase 项目并跑迁移

1. [supabase.com](https://supabase.com) → New Project（区域选 Singapore/Tokyo，离国内近）
2. SQL Editor → 按顺序执行 4 个迁移文件：
   `0001_init.sql` → `0002_leads_source.sql` → `0003_tier_and_channel.sql` → `0004_events.sql`
3. Settings → API 抄下 **Project URL** 与 **service_role key**

### 3. 配 Resend

1. 注册 → Domains → Add Domain → 加 SPF/DKIM/DMARC 三条 DNS
2. API Keys → Create → 抄下 `re_xxxxxx`
3. 等域名验证通过（通常几分钟到几小时）

### 4. 飞书机器人（可选）

群设置 → 群机器人 → 添加自定义机器人 → 抄 Webhook

---

## 阶段二：Vercel 部署（10 分钟）

### 1. 导入项目

[vercel.com](https://vercel.com) → Add New → Project → 选 GitHub 仓库 `qipei-web`

| 配置项 | 值 |
|---|---|
| Framework Preset | **Next.js**（自动识别） |
| Root Directory | `./`（若仓库根目录就是项目） |
| Build Command | 默认 `next build`（不用改） |
| Output Directory | 默认 `.next`（不用改） |
| Install Command | 默认 `npm install` |
| Node.js Version | **20.x**（Settings → General 里确认） |

### 2. 填环境变量（Environment Variables）

逐条添加，**全部勾选 Production / Preview / Development**：

| 变量名 | 值 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | **先临时填 `https://qipei-web.vercel.app`，绑域名后改回来并重部署** |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **敏感**，不能加 NEXT_PUBLIC_ 前缀 |
| `ADMIN_TOKEN` | 强随机串 | 用 `openssl rand -hex 32` 生成 |
| `RESEND_API_KEY` | `re_xxxxxx` | 敏感 |
| `RESEND_FROM_EMAIL` | `汽配知识局 <no-reply@yourdomain.com>` | |
| `LEAD_NOTIFY_EMAIL` | `you@yourdomain.com` | |
| `FEISHU_WEBHOOK_URL` | `https://open.feishu.cn/...` | 可选 |
| `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL` | 可选 | 不配则 AI 问答走关键词兜底 |
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXXXXX` | 可选 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `yourdomain.com` | 可选 |

> 改完环境变量必须 **Redeploy** 才生效（客户端变量会打进 bundle）。

### 3. 部署

点 Deploy → 等 2–3 分钟 → 得到 `https://qipei-web.vercel.app`

---

## 阶段三：绑域名

1. Vercel 项目 → Settings → Domains → Add → 填你的域名
2. 按提示到域名注册商加 DNS：
   - 根域名：`A` 记录 → `76.76.21.21`
   - 或 `www`：`CNAME` → `cname.vercel-dns.com`
3. 等 SSL 证书自动签发（Vercel 自动，几分钟）
4. **回到环境变量把 `NEXT_PUBLIC_SITE_URL` 改成真实域名 → Redeploy**
   （canonical、sitemap、OG 绝对地址都依赖它）

### 国内访问说明
- Vercel 在国内访问不稳定。**面向国内用户建议**：
  - 备案域名 + 国内 CDN（阿里云/腾讯云）回源 Vercel，或
  - 直接部署到腾讯云 CloudBase / 阿里云函数计算（需改适配，本项目为标准 Next.js，可跑 Node 运行时）
- 若走国内部署，`/api/*` 需保证可访问（Serverless 函数）。

---

## 阶段四：上线验收清单

### 功能
- [ ] 14 个页面 + 产品详情 + 洞察详情全部 200，无 404
- [ ] 表单提交成功 → Supabase `leads` 表有新记录 → 收到邮件与飞书
- [ ] 提交后自动跳 `/wechat?from=contact`，二维码位已替换真实活码
- [ ] 任意第三方链接点击弹拦截窗，放行后 URL 带 `utm_source=website`
- [ ] `/admin` 用 `ADMIN_TOKEN` 能登录、看板有数据、能导出 CSV

### SEO
- [ ] `/sitemap.xml` 返回 40 条且域名是真实域名
- [ ] `/robots.txt` 正确，且 `Disallow: /admin` 生效
- [ ] 抽查 3 个页面：`view-source` 里 title/description/canonical/og:image 各不相同
- [ ] `/og/*.png` 能直接访问
- [ ] Google Search Console 提交 sitemap；富媒体测试 Product/Course/FAQPage/Article 无报错

### 合规
- [ ] 隐私政策与条款里的品牌名、邮箱、ICP 备案号已替换
- [ ] 备案号放在页脚（国内上线必需）

### 移动端
- [ ] 手机逐页走一遍：无横向滚动、底部条不遮挡内容、表单可正常提交

---

## 常见部署问题

| 现象 | 原因 / 解法 |
|---|---|
| 构建报 EEXIST / mkdir 失败 | **仅本机**：WorkBuddy 注入的 fs shim 导致，Vercel 上不会出现；本机用 `env -u CODEBUDDY_SESSION_ID -u CLAUDE_SESSION_ID npm run build` |
| 页面能开但表单提交失败 | `SUPABASE_SERVICE_ROLE_KEY` 填错或没 Redeploy |
| 邮件收不到 | Resend 域名未验证 / from 地址域名与验证域名不一致 |
| OG 图在微信里不显示 | 微信抓取有缓存，用「微信开发者工具」清缓存重试；确保图片 < 300KB |
| sitemap 里还是占位域名 | `NEXT_PUBLIC_SITE_URL` 未改或未重新部署 |
| `/admin` 401 | 未设 `ADMIN_TOKEN` 或口令不符 |

---

## 后续更新流程

```bash
git add . && git commit -m "..." && git push
```
Vercel 自动构建部署（main 分支 → 生产环境；其他分支 → Preview 环境）。
回滚：Vercel → Deployments → 选历史版本 → Promote to Production。
