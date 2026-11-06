# 汽配知识局 → Cloudflare Pages 免费部署 + jinyoudata.com 绑定（傻瓜式手册）

> 目标：不买服务器、不做 ICP 备案，用 Cloudflare Pages 免费版托管官网，直接访问 `https://jinyoudata.com`，
> 彻底摆脱 WorkBuddy 临时链接的 `?sharecode=` 限制。
>
> 最后更新：2026-11-05　项目：`qipei-web`（Next.js 14.2.35 / App Router）

---

## ✅ 实际进展（2026-11-06 已执行完，此节优先于下文）

| 事项 | 状态 |
| --- | --- |
| 代码推 GitHub | **已完成**，`JinyouMate/qp` 分支 `main`，HEAD `6115a17`（SSH 密钥 `~/.ssh/id_ed25519_github_qipei`） |
| Cloudflare Pages 项目 | **已创建**：`qipei-web`，账号 `c8887f012b943118493574f8268764e7` |
| 首次部署 | **已上线**：<https://qipei-web.pages.dev>（裸链直达，**无 sharecode**） |
| 环境变量 | **已配置 6 个 secrets**：`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_TOKEN`、`RESEND_FROM_EMAIL`、`LEAD_NOTIFY_EMAIL` |
| 自定义域名 | 已在 Pages 项目里添加 `jinyoudata.com` 与 `www.jinyoudata.com`，状态 `pending`，等待 DNS 指向 |
| **待你操作** | ① 在 Cloudflare 添加 `jinyoudata.com` zone 并把腾讯云 NS 改过去（或只给 www 加 CNAME 到 `qipei-web.pages.dev`）；② Supabase 项目域名已 NXDOMAIN，需恢复或换新项目 |

### 构建期踩到的三个坑（已修好，别再改回去）

1. `/products` 读取 `searchParams` 属动态路由 → 必须 `export const runtime = "edge";`
2. `app/favicon.ico` 会被 Next 当成动态路由 → 已移到 `public/favicon.ico`，并在 `layout.tsx` 用 `icons` 声明
3. 动态详情页只写 `dynamicParams = false` 不够，Next 14 仍会生成 Node 兜底函数 → 必须同时 `export const dynamic = "force-static";`

本地可复现：`npm run pages:build` → 应输出 `84 prerendered routes` + 5 个 Edge 函数，exit 0。
部署：`npx wrangler pages deploy .vercel/output/static --project-name=qipei-web --branch=main`

---

## 0. 先看这里：本机已经改好的东西

以下改动**已经在本地改好**（工作区已就绪，但受本机工具环境的文件锁限制**还没能提交成 commit**）。
你不需要再写代码：按第 1 步在 GitHub Desktop 里填一句提交说明、点 Commit + Push 即可（它会同时处理 git 身份）。

| 文件 | 改动 |
| --- | --- |
| `package.json` | 新增 `pages:build` / `pages:dev` / `pages:deploy` 脚本；锁定 `@cloudflare/next-on-pages@1.13.14`、`vercel@47.0.4`、`wrangler@4.34.0`（**必须锁版本**，见下方风险提示） |
| `package-lock.json` | 同步精确版本 |
| `wrangler.toml` | 新增，Pages 项目名、兼容日期、`nodejs_compat`、构建产物目录 |
| `next.config.mjs` | 加入仅开发环境生效的 `setupDevPlatform()` |
| `app/api/{ai,leads,track,admin/leads,health}/route.ts` | `runtime = "nodejs"` 全部改为 `runtime = "edge"` |
| `app/insights/[slug]/page.tsx`、`app/products/[slug]/page.tsx` | 加 `dynamicParams = false`，避免生成 Node 兜底函数 |
| `app/api/leads/route.ts` | 邮件通知不再动态 `import("resend")`，改成直接 `fetch` Resend REST，边缘运行时零 Node 依赖 |
| `lib/seo.ts` | 默认 `SITE_URL` 由占位域名改为 `https://jinyoudata.com` |
| `scripts/gen-og.py` | OG 图上的域名改为 `jinyoudata.com` |
| `lib/brand.ts` | 官方服务邮箱统一为 `service@jinyoudata.com`，新增 `BRAND.emailHref` 供所有 mailto 链接复用 |
| `.env.example` | 站点地址与 Cloudflare 环境变量清单（邮件变量已填真实值） |
| `.npmrc` | `production=false`，强制 Cloudflare 安装 devDependencies（**否则构建必失败**，见 2.3） |
| `.gitignore` | 增加 `.wrangler/`、`.dev.vars` |

### 关键配置文件内容（可直接核对）

**wrangler.toml**
```toml
name = "qipei-web"
compatibility_date = "2025-09-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

**package.json 的 scripts**
```json
{
  "pages:build": "next-on-pages",
  "pages:dev": "npm run pages:build && wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat",
  "pages:deploy": "npm run pages:build && wrangler pages deploy .vercel/output/static --project-name=qipei-web"
}
```

**每个 API 路由文件顶部**
```ts
export const runtime = "edge";
```

### ⚠️ 一个必须知道的版本坑

`@cloudflare/next-on-pages` 最新版 `1.13.16` 的 peer 依赖是 `next >=14.3.0 && <=15.5.2`，
而本项目是 **Next 14.2.35**，直接装最新版会 `ERESOLVE` 报错；用 `npx @cloudflare/next-on-pages@1` 也会拉到最新版导致构建失败。
所以本项目**锁死 1.13.14**（该版本官方声明支持 Next.js 13/14 全部 minor/patch）。
**控制台里的构建命令务必填 `npm run pages:build`，不要填 `npx @cloudflare/next-on-pages@1`。**

另外，Cloudflare 官方 2026 年已把 Next.js 新项目的推荐路径改成 Workers + vinext/OpenNext，
`@cloudflare/next-on-pages` 处于维护状态。但对「Next 14.2 + 静态页面为主 + 4 个简单 API」的本项目，
它仍然是改动最小、能上 Cloudflare Pages 免费版的方案。若未来要升级 Next 16，再考虑迁移。

### 本地验证状态（如实说明）

- ✅ 已核对：官方 `supported.md` 明确「支持 Next.js 13 和 14 的全部 minor/patch 版本」；
  5 个 API 路由全部是 `runtime = "edge"`；两个动态路由已设 `dynamicParams = false`；
  `wrangler.toml` 用 TOML 解析器校验通过；`tsc --noEmit` 在本次改动的文件里**零报错**
  （仅 `lib/data.ts` 有 2 处历史遗留类型报错，项目本来就有 `ignoreBuildErrors`，不影响构建）。
- ⚠️ **没跑完**本地 `npm run pages:build`：本机 WorkBuddy 工具环境的文件删除保护会拦截
  `vercel build` 清理 `.vercel/output/builds.json`（`EPERM: operation not permitted, unlink`），
  这是本地沙箱限制，不是项目代码问题。Cloudflare 的构建容器没有这层限制。
  因此**首次部署请以控制台构建日志为准**，若报错把日志贴给我，按第 5 节排错表处理。

---

## 1. 第一步：把代码推到 GitHub

### 现状（我帮你查过了）

- 项目路径：`/Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web`
- 本地分支 `main`，最新提交 `a1b47b1`，远端已配置 `https://github.com/JinyouMate/qp.git`
- `.env.local`（含真实 Supabase 密钥）**已被 .gitignore 忽略，不在仓库里**，可以放心推
- 但本机终端访问 GitHub 返回 `CONNECT tunnel failed, response 502`（代理/网络问题），
  所以**命令行推送可能失败**；另外 `git config user.name/email` 还没设置
- ⚠️ 本机工具环境残留了一个 `.git/index.lock` 和几个 4 字节临时文件，**在普通终端里先执行一次清理**（不要在工作助手的终端里跑，那里删不掉）：

```bash
cd /Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web
rm -f .git/index.lock 53ur17fk lnulqqo6 cuy7xo1x
git status --short     # 能正常列出改动，就说明锁清掉了
```

> 这一步很关键：有 `index.lock` 时任何 `git add` / `commit` 都会报
> `Unable to create '.git/index.lock': File exists`。

### 方式 A：GitHub Desktop（最省事，推荐，能绕开终端代理问题）

1. 下载安装 <https://desktop.github.com/>，打开后用浏览器登录你的 GitHub 账号（`JinyouMate`）。
2. 菜单 `File → Add Local Repository…`，选择目录
   `/Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web`，确认添加。
3. 左侧 **Changes** 会列出本次所有改动（`wrangler.toml`、部署指南、5 个 API 路由等）。
   在左下角 Summary 填一句 `Cloudflare Pages 适配`，点 **Commit to main**。
   （GitHub Desktop 用登录账号自动设置提交身份，不用手配 `user.name/email`。）
4. 因为仓库里已经有 remote，右上角会显示 `Push origin`（如果远端仓库还不存在，会显示
   `Publish repository` → 勾选 **Keep this code private** → 点 Publish）。
5. 点 `Push origin`。等进度条走完，去 <https://github.com/JinyouMate/qp> 刷新，
   能看到 `docs/Cloudflare-Pages-部署指南.md`、`wrangler.toml` 就成功了。
6. 如果 GitHub 上还没有这个仓库：在 GitHub 网页右上角 `+ → New repository`，
   Name 填 `qp`，选 **Private**，**不要**勾选 Add README / .gitignore（本地已有），Create repository；
   再回 GitHub Desktop 点 Publish。

> 仓库建议设为 **Private（私有）**：Cloudflare 通过 OAuth 授权后可以访问私有仓库，
> 站点源码没必要公开。

### 方式 B：命令行（网络正常时）

```bash
cd /Users/qiuganyou/WorkBuddy/2026-10-16-12-18-51/qipei-web

# 第一次用 git 需要先设置身份（GitHub Desktop 方式不用管这两行）
git config user.name  "JinyouMate"
git config user.email "jinyoumate@163.com"

git status --short          # 确认没有 .env.local
git check-ignore .env.local # 输出 .env.local 表示已被忽略，安全

git add -A
git commit -m "Cloudflare Pages 适配"
git push -u origin main
```

如果提示输入密码：GitHub 早已不支持账号密码，必须改用 **Personal Access Token**：
<https://github.com/settings/tokens> → `Generate new token (classic)` → 勾选 `repo` → 生成 →
把那串 `ghp_...` 当作**密码**粘贴。

或者装 GitHub CLI 走浏览器授权（更省事）：

```bash
brew install gh
gh auth login        # GitHub.com → HTTPS → Login with a web browser
gh auth setup-git
git push -u origin main
```

如果还是 `CONNECT tunnel failed / 502`，说明是代理问题：
- 关掉终端里的科学上网代理再试，或
- 按你代理软件的实际端口设置：`git config --global http.proxy http://127.0.0.1:7890`
  （不需要时 `git config --global --unset http.proxy` 撤销），
- 或者直接改用上面的方式 A（GitHub Desktop 走系统网络栈，通常不受终端代理影响）。

---

## 2. 第二步：在 Cloudflare 连接 GitHub 并部署

### 2.1 建项目

1. 注册/登录 <https://dash.cloudflare.com/>（免费账号即可，不需要绑信用卡）。
2. 左侧 **Workers & Pages** → **Create application** → 切到 **Pages** 标签 → **Connect to Git**。
3. 选 **GitHub** → 首次会跳授权页 → `Authorize Cloudflare` → 允许访问仓库
   （如果列表里看不到私有仓库，点 `Configure` / `Install` 把 `qp` 仓库加进授权范围）。
4. 选中 `JinyouMate/qp`，点 **Begin setup**。
5. Project name 填 `qipei-web`（会生成 `qipei-web.pages.dev`），Production branch 选 `main`。

### 2.2 构建设置（照抄，一项都别改）

| 字段 | 填什么 |
| --- | --- |
| Framework preset | `Next.js`；**如果下拉里没有 Next.js 就选 `None`**（手动填下面两行效果完全一样） |
| Build command | `npm run pages:build` ← **不要用 `npx @cloudflare/next-on-pages@1`** |
| Build output directory | `.vercel/output/static` |
| Root directory | 留空 `/` |
| Build system version | 默认 v2 或 v3 都行 |

### 2.3 环境变量（**在建项目的同一页就能加，别等部署完再加**）

点开 **Environment variables (advanced) → Add variable**，逐条加。
`Production` 必填；`Preview` 想让预览分支也能连数据库就同样加一份。

| 变量名 | 值 | 是否加密 | 说明 |
| --- | --- | --- | --- |
| `NODE_VERSION` | `20` | 明文 | 构建用 Node 20，必填 |
| `NPM_CONFIG_PRODUCTION` | `false` | 明文 | **必填**。Cloudflare 默认注入 `NODE_ENV=production` 会让 npm 跳过 devDependencies，导致 `next-on-pages: not found`。仓库里已放 `.npmrc` 兜底，控制台再加一条双保险 |
| `NEXT_PUBLIC_SITE_URL` | `https://jinyoudata.com` | 明文 | canonical / sitemap / OG 地址，**不带结尾斜杠** |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxx.supabase.co` | 明文 | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | **点 Encrypt** | 同页面 `service_role` (secret)，**不是 anon key** |
| `ADMIN_TOKEN` | 一串长随机字符串 | **点 Encrypt** | `/admin` 与 `/api/health` 的口令，自己定 |
| `RESEND_API_KEY` | `re_xxx` | **点 Encrypt** | 选填，留资邮件通知 |
| `RESEND_FROM_EMAIL` | `汽配知识局 <service@jinyoudata.com>` | 明文 | 选填，需先在 Resend 验证 `jinyoudata.com` 发信域 |
| `LEAD_NOTIFY_EMAIL` | `service@jinyoudata.com` | 明文 | 选填，官方服务邮箱（腾讯企业邮箱） |
| `FEISHU_WEBHOOK_URL` | 飞书机器人地址 | **点 Encrypt** | 选填 |
| `AI_API_KEY` / `AI_BASE_URL` / `AI_MODEL` | 你的模型配置 | **Encrypt 密钥** | 选填，不填 AI 问答走关键词兜底 |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | 统计 ID | 明文 | 选填 |

> **腾讯企业邮箱已开通（2026-11-05）**：全站对外展示邮箱统一为 `service@jinyoudata.com`，
> 唯一来源是 `lib/brand.ts` 的 `BRAND.email` / `BRAND.emailHref`，所有页面都渲染成
> `<a href="mailto:service@jinyoudata.com">service@jinyoudata.com</a>`。
> 上表两个邮件变量只用于「留资通知」，不显示在页面上。若用 `service@jinyoudata.com`
> 作发信人，需在 Resend 验证 `jinyoudata.com`（腾讯企业邮箱的 MX 不动，只追加
> Resend 给的 SPF / DKIM TXT 记录），否则邮件会退信，但留资仍正常写入 Supabase。

三条铁律：

1. **所有密钥只在 Cloudflare 控制台填**，绝不要写进 `wrangler.toml` 或提交到 GitHub。
2. `NEXT_PUBLIC_*` 是**构建期**内联进 HTML 的 → 先加变量、再部署；后续改值必须**重新部署**才生效。
3. `SUPABASE_SERVICE_ROLE_KEY` 拥有数据库全权限，泄漏风险很高，务必点 Encrypt。

### 2.4 必做：开启 Node 兼容标志

首次部署完成后（第一次可能是白屏/500，正常）：

1. 项目页 → **Settings** → **Functions** → **Compatibility flags**
2. **Production** 和 **Preview** 两个环境**各加一条** `nodejs_compat`
3. **Compatibility date** 保持默认（≥ `2022-11-30` 即可）
4. 回 **Deployments** → 最新一条右侧 `…` → **Retry deployment**（必须重新部署一次才生效）

> 仓库里的 `wrangler.toml` 也写了 `nodejs_compat`，但 Git 集成项目以控制台设置为准，两边都要有。

### 2.5 验收

打开 `https://qipei-web.pages.dev`（或控制台给的 `<项目名>.pages.dev`），首页能显示即成功。
再访问 `https://<你的项目>.pages.dev/api/health?token=<你设的 ADMIN_TOKEN>`，
看到 `"supabaseConfigured": true` 且 `"write": "✅ 写入成功…"` 说明数据库环境变量生效。

---

## 3. 第三步：绑定 jinyoudata.com（改 NS → 自动 CNAME → 自动 SSL）

### 3.1 先把域名接入 Cloudflare（改 NS）

1. Cloudflare 控制台左侧 **Domains**（或右上角 `+ Add a site` / **Onboard a domain**）→
   输入 `jinyoudata.com` → Continue → 选 **Free** 计划 → Continue。
2. Cloudflare 会**自动扫描现有 DNS 记录**并列出结果。**逐条核对**，尤其：
   - `MX` 记录（企业邮箱/域名邮箱）、`TXT`（SPF、DKIM、`_dmarc`）、其它子域名的 A/CNAME；
   - 之前给 WorkBuddy 临时域名配的 CNAME / A 记录（指向内部 CLB 的）已经没用，可以删掉。
   - 快速扫描不保证完整，缺的记录手动补上，别急着激活。
3. 下一步 Cloudflare 会给你 **2 个 nameserver**，形如
   `xxxx.ns.cloudflare.com` / `yyyy.ns.cloudflare.com` —— **复制下来**（Overview 页面以后也能看）。

4. 到腾讯云 / DNSPod 改 NS：
   - 腾讯云控制台 → **域名注册**（或 DNSPod → 我的域名）→ 找到 `jinyoudata.com` →
     **管理 / 域名信息 → DNS 服务器 / 修改 DNS 服务器**；
   - 选「自定义 DNS / 修改 NS」，**删掉原来的 `*.dnspod.net` 之类的两条**，
     把 Cloudflare 给的两条**一字不差**填进去 → 保存；
   - 如果提示「域名已锁定 / 禁止更新」，先关闭「域名安全锁 / 禁止更新锁」再改。
   - **DNSSEC 特别提醒**：如果域名开了 DNSSEC，必须**先在腾讯云关闭/删除 DS 记录**，
     否则换 NS 后域名会解析不到；等 Cloudflare 里状态变成 Active 之后，
     再到 Cloudflare DNS → Settings → Enable DNSSEC 重新开启。

5. 等待生效：通常 10 分钟～2 小时，最长 **24 小时**。
   Cloudflare 会发一封「domain is now active」的邮件，Domains 页面状态变成 **Active**。
   自检命令：
   ```bash
   dig ns jinyoudata.com @1.1.1.1     # 应返回 *.ns.cloudflare.com
   ```

> 为什么必须改 NS？因为你要绑定的是**根域名 `jinyoudata.com`**。
> 根域名（apex）要挂到 Pages，Cloudflare 要求该域名是它自己托管的 zone（它会用 CNAME Flattening 自动处理根域）。
> 只绑 `www.jinyoudata.com` 的话可以不改 NS，但主域就访问不了。

### 3.2 在 Pages 项目里绑定域名（DNS 记录由 Cloudflare 自动生成）

1. **Workers & Pages** → 选 `qipei-web` 项目 → **Custom domains** → **Set up a domain**。
2. 输入 `jinyoudata.com` → Continue。
   Cloudflare 会提示将自动添加所需的 DNS 记录（根域用 CNAME 扁平化 / A+AAAA），确认即可 → **Activate domain**。
3. 再点一次 **Set up a domain** 添加 `www.jinyoudata.com`，同样自动建 CNAME。
4. 状态从 `Initializing` → `Active` 一般几分钟内完成。

> ⚠️ **千万不要跳过这一步、自己手写一条 CNAME 指向 `xxx.pages.dev`**。
> 官方文档明确：没先在 Custom domains 里关联域名就手动加 CNAME，会直接 **522 错误**。
> 顺序永远是「先在 Pages 里绑定 → Cloudflare 自动建记录」。

### 3.3 SSL 证书（自动，免费）

1. 左侧 **SSL/TLS** → **Overview** → 加密模式选 **Full (strict)**。
   **不要选 Flexible**，Pages 的「源站」就是 Cloudflare 自己，Flexible 会造成无限重定向。
2. **SSL/TLS → Edge Certificates**：Universal SSL 默认开启，域名激活后 Cloudflare 自动向
   Let's Encrypt / Google Trust Services 申请并续期一张 DV 证书，**覆盖 `jinyoudata.com` 和 `www.jinyoudata.com`**。
   一般 15～30 分钟，最长 24 小时，状态变成 `Active certificate` 即可。
3. 打开 **Always Use HTTPS**（SSL/TLS → Edge Certificates 或 Rules 里）。
4. 如果证书一直 `Pending`：检查 DNS 里是否有 **CAA 记录**。有的话必须放行 Cloudflare 的 CA：
   ```
   0 issue "letsencrypt.org"
   0 issue "pki.goog; cansignhttpexchanges=yes"
   0 issue "ssl.com"
   0 issuewild "letsencrypt.org"
   0 issuewild "pki.goog; cansignhttpexchanges=yes"
   0 issuewild "ssl.com"
   ```
   新接入的 zone 通常没有 CAA，没看到就跳过。

### 3.4 可选：统一到主域

`Rules → Redirect Rules`（或 Bulk Redirects）建一条：
`www.jinyoudata.com/*` → 301 → `https://jinyoudata.com/$1`。
也可以把 `<项目名>.pages.dev` 一并 301 到主域，避免搜索引擎收录两份。

### 3.5 关于「不备案」

Cloudflare 免费版的中国大陆访问走境外边缘节点（香港/新加坡/东京等），
**不需要 ICP 备案**即可绑定自定义域名并签发证书；代价是国内访问速度会比备案后慢一些，
偶尔受跨境网络波动影响。这属于正常现象，不是配置错误。

---

## 4. 第四步：彻底去掉 `?sharecode=`

### 4.1 结论：不用改代码，换个平台就自动没了

`?sharecode=HAUM43R6FK` 是 **WorkBuddy「应用发布」网关**加在
`qipei-knowledge.app.workbuddy.host` 上的访问控制：网关校验参数后下发 30 天 Cookie `__wb_rsc`，
不带参数就 403。它是**平台层限制，不在本项目代码里**——我把整个仓库搜了一遍，
没有任何 `sharecode` / `workbuddy.host` / `qipei-knowledge` 字样。

迁移到 Cloudflare Pages 后，访客访问 `https://jinyoudata.com`：
`浏览器 → Cloudflare 边缘 → Pages 项目`，完全不经过 WorkBuddy 网关，
因此**直接输入域名就能打开，没有任何参数、Cookie 或白名单**。

### 4.2 为了保证「干净上线」已经做的收口

- `lib/seo.ts` 默认站点地址 → `https://jinyoudata.com`（canonical / sitemap.xml / robots.txt / OG 全部跟着变）
- `scripts/gen-og.py` 的 OG 图域名 → `jinyoudata.com`
  （已生成的 `public/og/*.png` 上还是旧文字，想换就本地跑一次
  `/Users/qiuganyou/.workbuddy/binaries/python/envs/default/bin/python scripts/gen-og.py` 再提交）
- `.env.example` 加上 Cloudflare 变量清单
- 控制台里 `NEXT_PUBLIC_SITE_URL=https://jinyoudata.com`（**构建期变量，改完必须重新部署**）

### 4.3 收尾动作（建议做）

1. 把 WorkBuddy 里旧的「应用发布」**取消发布**（避免同一套内容两份站点、SEO 重复收录）。
2. 旧短链 `https://v.gd/EOoZ2x` 仍指向带 sharecode 的旧地址，重新生成一个指向
   `https://jinyoudata.com` 的短链对外用。
3. `__wb_rsc` Cookie 绑定的是旧域名，不会带到新域名，无需清理。
4. 如果有人误带 `?sharecode=` 访问，Cloudflare 会直接忽略这个无意义参数返回页面，
   不会出现 403；想更干净可在 Rules 里做一条去掉查询参数的重定向（非必需）。

### 4.4 上线验收清单

```bash
# 1) 裸域直达（重点）
curl -I https://jinyoudata.com/
# 期望：HTTP/2 200，Location 里不含 sharecode

# 2) 证书
curl -vI https://jinyoudata.com/ 2>&1 | grep -i "subject\|issuer"

# 3) SEO 地址已切到新域名
curl -s https://jinyoudata.com/sitemap.xml | head -5
curl -s https://jinyoudata.com/robots.txt | head -8

# 4) 数据库真的通了（把 <TOKEN> 换成 ADMIN_TOKEN）
curl -s "https://jinyoudata.com/api/health?token=<TOKEN>" | head -c 800
```

再在浏览器**无痕窗口**里：
- 地址栏只输入 `jinyoudata.com` → 首页正常、锁形图标正常；
- 随便点几个页面、打开名片弹窗；
- 在 `/contact` 提交一条测试留资 → 去 Supabase `leads` 表确认多了一行；
- 打开 `/admin` 输入 `ADMIN_TOKEN` → 能看到线索看板。

---

## 5. 排错速查表

| 现象 | 原因 / 处理 |
| --- | --- |
| 构建报 `next-on-pages: not found` / `tailwindcss: not found` | Cloudflare 跳过了 devDependencies。确认控制台有 `NPM_CONFIG_PRODUCTION=false`、仓库里有 `.npmrc`；再不行加 `SKIP_DEPENDENCY_INSTALL=true`，把构建命令改成 `npm install --include=dev && npm run pages:build` |
| 构建报 `ERESOLVE` / `next@>=14.3.0` | 用 `npm run pages:build`（锁定的 1.13.14），别用 `npx @cloudflare/next-on-pages@1` |
| 构建报 `Node.js runtime is not supported` | `app/api/**/route.ts` 缺 `export const runtime = "edge"`；新增接口必须加这一行 |
| 构建报 `node:fs` / `node:path` 无法打包 | 别在 API 路由里 import `lib/insights.ts` 这类依赖 Node fs 的模块；目前只在构建期静态页用，没问题 |
| 部署成功但页面 500 / 白屏 | Settings → Functions → Production **和** Preview 都加 `nodejs_compat`，然后 Retry deployment |
| 自定义域名 522 | 没先在 Pages → Custom domains 里绑定就手写了 CNAME；删掉手写记录，走绑定流程 |
| 无限重定向 | SSL/TLS 加密模式改 **Full (strict)**，别用 Flexible |
| 域名一直 Pending Nameserver Update | NS 没改对 / DNSSEC 没关 / 域名被锁定；`dig ns jinyoudata.com @1.1.1.1` 核对 |
| 证书一直 Pending | 检查 CAA 记录是否放行 letsencrypt / pki.goog / ssl.com |
| 留资不入库，但页面正常 | 环境变量没配、配错成 anon key、或配完没重新部署；用 `/api/health?token=` 看 `supabaseConfigured` |
| canonical / sitemap 还是旧域名 | `NEXT_PUBLIC_SITE_URL` 是构建期变量，改完必须重新部署 |
| 某个 `/products/xxx` 详情页 404 | 正常：Cloudflare 版只发布预渲染的 slug（`dynamicParams = false`），新增产品要重新构建 |
| 国内访问偏慢 | 免费版无中国大陆节点（需备案 + 企业版中国网络），属正常 |
| `next dev` 本地起不来 | `next.config.mjs` 里的 `setupDevPlatform()` 有 try/catch，会打印警告但不会阻断 |

### 免费额度（够用）

Pages：每月 500 次构建、无限带宽、无限静态请求；Functions 每天 10 万次请求（免费版）。
本项目以静态页为主，正常流量远低于上限。

### 日常改版流程

本地改代码 → `git push origin main` → Cloudflare 自动触发构建 → 几分钟后线上生效。
改环境变量 → 控制台改完 → Deployments → **Retry deployment**（不会自动重跑）。
本地想预览 Pages 运行时：`npm run pages:dev`（需要 wrangler 登录 `npx wrangler login`）。
