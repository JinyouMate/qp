-- 0003: 产品阶梯 tier + 线索来源渠道 channel

-- 1. products 增加价格阶梯 ------------------------------------
alter table public.products
  add column if not exists tier text not null default 'free'
  check (tier in ('free','toolkit','course','enterprise'));

comment on column public.products.tier is
  '价格阶梯：free 免费内容 / toolkit 工具包99-499 / course 课程订阅999-4999 / enterprise 咨询内训1万+';

-- 已有数据按现有价格回填阶梯
update public.products set tier = 'toolkit'
  where slug in ('toolkit-selection','toolkit-pricing','toolkit-fitment','toolkit-inventory');
update public.products set tier = 'course'
  where slug in ('courses','full-reports','data-subscription','annual-pass');
update public.products set tier = 'enterprise'
  where slug in ('consulting','corporate-training','saas-cooperation','ai-data');
update public.products set tier = 'free'
  where slug in ('content-ip','sop-checklists','report-briefs','knowledge-base','templates','case-library');

-- 2. 阶梯二：工具包产品（99-499）种子数据 -----------------------
insert into public.products (slug,name,icon,layer,category,tier,positioning,problem,audience,deliverable,price,cta_type,third_party_platform,sort) values
  ('toolkit-selection','选品评分工具包','calculator','conversion','knowledge','toolkit','把「要不要进这批货」变成一张能算出分数的表','选品靠感觉，胜负说不清为什么','每周要做选品决策的卖家与采购','五维评分表+测款记录表+复盘模板','¥199','buy','小鹅通',20),
  ('toolkit-pricing','核价毛利工具包','coins','conversion','knowledge','toolkit','算清楚到手多少钱','跨境与多平台定价漏算汇率佣金物流','做跨境与多平台的卖家','成本核算表+汇率折算器+毛利校验表','¥299','buy','小鹅通',21),
  ('toolkit-fitment','适配校验工具包','scan-search','conversion','knowledge','toolkit','按三层校验法把适配数据过一遍','适配错误导致退货差评压货','被适配问题拖住的团队与修理厂','交叉验证清单+存疑标记表+回测记录表','¥399','buy','小鹅通',22),
  ('toolkit-inventory','库存周转工具包','boxes','conversion','knowledge','toolkit','把压在仓库里的钱算清楚','滞销占压资金不知该清哪些','有现货库存的经销商与修理厂','安全库存模型+滞销分级表+分流方案','¥199','buy','小鹅通',23),
  ('annual-pass','年度知识通行证','badge-check','conversion','courses','course','一年内全部课程+工具包+报告更新','单买太贵又不想错过更新','长期在这个行业做的个人与团队','年度权益+资料库全权限+闭门直播','¥4,999/年','buy','小鹅通',24)
on conflict (slug) do nothing;

-- 3. leads 增加来源渠道 ---------------------------------------
alter table public.leads
  add column if not exists channel text not null default 'other'
  check (channel in ('douyin','channels','zhihu','wechat_mp','bilibili','search','direct','other'));

comment on column public.leads.channel is '留资来源：抖音/视频号/知乎/公众号/B站/搜索/直接访问/其他';

-- 常用查询索引
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_channel on public.leads (channel);
