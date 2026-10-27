-- 0007 · 全站转化收口统一到企业微信
--
-- 背景：官网不再接入/跳转任何第三方成交平台（知识星球、小鹅通等已下线）。
-- 现在所有转化按钮只弹「企微二维码弹窗」，扫码后由系统自动下发
-- 内部资料库链接，并邀请加入行业交流群。
--
-- 本迁移只清理 products 表里已经无用的第三方平台字段，
-- 不动任何结构与数据完整性，可重复执行（幂等）。

update public.products
   set third_party_url = null,
       planet_url      = null
 where third_party_url is not null
    or planet_url is not null;

-- 交付口径统一为企业微信；历史留空的仍留空（免费资料无交付平台概念）
update public.products
   set third_party_platform = '企业微信'
 where third_party_platform is not null
   and third_party_platform <> '企业微信';

comment on column public.products.third_party_url is
  '已废弃：官网不再跳转任何第三方平台链接，转化统一收口到企业微信二维码弹窗';
comment on column public.products.third_party_platform is
  '交付渠道说明（统一为企业微信）；前端已不再展示该字段';
comment on column public.products.planet_url is
  '已废弃（原知识星球邀请链接），不再使用';
