-- ============================================================
-- 0008 三库商业矩阵：给产品打标（知识库 / 工具库 / 数据库）
-- 2026-11-14 定调，全站封板。
--
-- 背景：官网与中控台共用 products 表。历史数据里还是旧的 tier 枚举
-- （free / toolkit / subscription / enterprise）与改版前的名字、价格，
-- 导致第三档（数据订阅）在官网整块消失、中控台口径也对不上。
--
-- 本迁移做两件事：
--   1) 新增 library 字段（kb / tools / data / custom），作为唯一归类口径；
--   2) 按 slug 回填三库标签，并把名称与定价刷成新口径。
--
-- 执行方式：Supabase SQL Editor 整段执行即可（幂等，可重复跑）。
-- ============================================================

alter table public.products
  add column if not exists library text;

-- ---------- 板块一 · 知识库（免费 / ¥9.9 引流） ----------
update public.products set library = 'kb' where slug in (
  'knowledge-base',   -- 避坑指南
  'full-reports',     -- 行业报告
  'sop-checklists',   -- 合规 SOP 清单
  'report-briefs',    -- 行业报告摘要
  'templates',        -- 模板库
  'case-library',     -- 案例库
  'content-ip'        -- 内容 IP
);

-- ---------- 板块二 · 工具库（¥99 – ¥299） ----------
update public.products set library = 'tools' where slug in (
  'toolkit-selection',  -- 选品评分表
  'toolkit-pricing',    -- 核价毛利计算器
  'toolkit-fitment',    -- 适配校验表
  'toolkit-inventory'   -- 库存周转模板
);

-- ---------- 板块三 · 数据库（¥999 / 年） ----------
update public.products set library = 'data' where slug in ('data-subscription');

-- ---------- 定制合作（不占三库板块） ----------
update public.products set library = 'custom' where slug in (
  'consulting', 'saas-cooperation', 'ai-data'
);

-- ---------- 名称与定价对齐新口径 ----------
update public.products set name = '避坑指南'          where slug = 'knowledge-base';
update public.products set name = '行业报告',     price = '¥9.9 · 引流价' where slug = 'full-reports';
update public.products set name = '合规 SOP 清单'     where slug = 'sop-checklists';
update public.products set name = '模板库',       price = '¥9.9 · 引流价' where slug = 'templates';
update public.products set name = '选品评分表'        where slug = 'toolkit-selection';
update public.products set name = '核价毛利计算器'    where slug = 'toolkit-pricing';
update public.products set name = '适配校验表',   price = '¥299' where slug = 'toolkit-fitment';
update public.products set name = '库存周转模板'      where slug = 'toolkit-inventory';

update public.products
   set name        = '金游™ 数据中台账号',
       price       = '¥999 / 年',
       positioning = '开通中控台专属账号，看透真实利润',
       deliverable = '中控台 Client 只读账号（一人一号）+ 312 万 SKU 检索 + OE 号匹配 + 万家供货商评级，无限次查询'
 where slug = 'data-subscription';

-- ---------- 兜底：库里若有剩余旧 tier 产品，按旧枚举归位，避免整块板块空掉 ----------
update public.products set library = 'kb'    where library is null and tier = 'free';
update public.products set library = 'tools' where library is null and tier = 'toolkit';
update public.products set library = 'data'  where library is null and tier = 'subscription';
update public.products set library = 'custom' where library is null;

-- 校验：每个板块各有多少条
-- select library, count(*) from public.products group by library order by library;
