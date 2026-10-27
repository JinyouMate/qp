/* ============================================================
   0006 · 知识星球专属入口 products.planet_url

   背景（重大策略）：本项目**不接入任何原生支付**（无支付宝 / 微信支付 / 站内收银台）。
   官网只负责：展示 → 建立信任 → 留资收口 → 跳转。
   产品的成交与交付全部在**知识星球**完成。

   字段语义：
     third_party_url     第三方平台/内容入口（保留，兼容旧数据）
     planet_url          该产品的知识星球专属邀请链接（主力字段）

   优先级：planet_url → third_party_url → 全局兜底（前端 BRAND/PLANET 常量）→ 弹窗内降级提示
   ============================================================ */

alter table public.products add column if not exists planet_url text;

comment on column public.products.planet_url is
  '知识星球专属邀请链接。前端自动附加 utm_source=website&utm_medium=product&utm_campaign={product_id}';

/* 链接必须是 http(s)，填了就必须合法（空值允许） */
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_planet_url_check'
  ) then
    alter table public.products
      add constraint products_planet_url_check
      check (planet_url is null or planet_url = '' or planet_url like 'http://%' or planet_url like 'https://%');
  end if;
end
$$;

/* ---------------- 配置示例（按产品执行） ----------------
update public.products set planet_url = 'https://t.zsxq.com/你的星球邀请码'
 where slug = 'annual-pass';

update public.products set planet_url = 'https://t.zsxq.com/你的星球邀请码'
 where slug = 'courses';

-- 批量查未配置的产品
select id, slug, name from public.products
 where coalesce(planet_url, '') = '' order by id;
---------------------------------------------------------- */
