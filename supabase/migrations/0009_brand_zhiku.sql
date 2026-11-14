-- ============================================================
-- 0009 · 品牌升维：「数据中台 / 中控台」→「金游数据智库」
--
-- 背景：官网已经是「金游数据智库」口径，但 supabase products 表里
-- 仍留着 0008 写入的旧产品名「金游™ 数据中台账号」与「中控台」文案。
-- 官网读取层目前用代码目录覆盖，不会露出旧名；但中控台后台直接读库，
-- 所以这里把库里的名称与文案一次性对齐，避免两边说法不一致。
--
-- 幂等：可重复执行。
-- ============================================================

-- ---------- 核心产品：999 元/年的专属查询账号 ----------
update public.products
   set name        = '金游智库·专属查询账号',
       price       = '¥999 / 年',
       positioning = '开通金游智库专属查询账号，看透真实利润',
       deliverable = '金游智库 Client 只读账号（一人一号）+ 312 万 SKU 检索 + OE 号匹配 + 万家供货商评级，无限次查询'
 where slug = 'data-subscription';

-- ---------- 其余条目：清掉文案里残留的「数据中台 / 中控台」 ----------
update public.products
   set positioning = replace(replace(replace(positioning, '数据中控台', '金游数据智库'), '数据中台', '金游数据智库'), '中控台', '金游数据智库')
 where positioning ~ '数据中控台|数据中台|中控台';

update public.products
   set deliverable = replace(replace(replace(deliverable, '数据中控台', '金游数据智库'), '数据中台', '金游数据智库'), '中控台', '金游数据智库')
 where deliverable ~ '数据中控台|数据中台|中控台';

update public.products
   set problem = replace(replace(replace(problem, '数据中控台', '金游数据智库'), '数据中台', '金游数据智库'), '中控台', '金游数据智库')
 where problem ~ '数据中控台|数据中台|中控台';

-- 名称里若还有旧写法（例如「金游™ 数据中台账号」），统一改写
update public.products
   set name = '金游智库·专属查询账号'
 where name ~ '数据中台|中控台';

-- 校验：应返回 0 行
-- select slug, name from public.products where name ~ '数据中台|中控台'
--    or positioning ~ '数据中台|中控台' or deliverable ~ '数据中台|中控台';
