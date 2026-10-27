# 文档索引

按交付顺序排列：

| 步骤 | 文档 | 内容 |
|---|---|---|
| 1 | [01-需求文档.md](./01-需求文档.md) | 定位、商业模式、四类用户、信息架构、功能需求、验收清单 |
| 1 | [02-页面原型文字版.md](./02-页面原型文字版.md) | 17 个页面的线框（区块 + 字段 + 交互说明） |
| 2 | [03-设计系统.md](./03-设计系统.md) | 色板、字体、圆角阴影、栅格、组件视觉规范 |
| 2 | [04-组件清单.md](./04-组件清单.md) | UI 组件 + 站点业务组件 API、数据层、选用速查 |
| 3 | [05-首页实现说明.md](./05-首页实现说明.md) | 首页 10 个模块、关键片段、改文案位置 |
| 4 | [06-产品中心与详情模板.md](./06-产品中心与详情模板.md) | 列表页结构、详情模板、如何新增产品 |
| 5 | [07-留资表单与数据库与通知.md](./07-留资表单与数据库与通知.md) | 表单字段、API、Supabase 迁移、Resend/飞书配置 |
| 6 | [08-第三方跳转与UTM追踪.md](./08-第三方跳转与UTM追踪.md) | 拦截弹窗、UTM 规范、渠道归类、事件埋点 |
| 7 | [09-SEO配置.md](./09-SEO配置.md) | 元数据、OG 图、sitemap、robots、Schema、MDX |
| 8 | [10-部署到Vercel.md](./10-部署到Vercel.md) | 准备、部署、绑域名、上线验收清单 |
| 9 | [11-后台管理使用说明.md](./11-后台管理使用说明.md) | 登录、看板、筛选、导出 CSV、状态流转、常用 SQL |

## 快速上手

```bash
# 本地开发
npm run dev

# 生产构建（本机需绕过 fs shim）
env -u CODEBUDDY_SESSION_ID -u CLAUDE_SESSION_ID npm run build

# 重新生成全部 OG 图（改了产品/文章后跑）
/Users/qiuganyou/.workbuddy/binaries/python/envs/default/bin/python scripts/gen-og.py

# 环境变量
cp .env.example .env.local    # 然后填真实值
```

## 上线前必改

1. `NEXT_PUBLIC_SITE_URL` → 真实域名（canonical / sitemap / OG 都依赖它）
2. 品牌名、企微活码、邮箱、ICP 备案号
3. 第三方购买链接（`products.third_party_url`）
4. `ADMIN_TOKEN` 换成强随机串
