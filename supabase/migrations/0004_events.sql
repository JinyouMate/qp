-- ============================================================
-- 0004：站点事件表（供 /admin 看板算转化率）
-- 执行：Supabase SQL Editor 粘贴运行，或 supabase db push
-- ============================================================

create table if not exists public.events (
  id          bigserial primary key,
  event       text not null,          -- form_submit / wechat_click / third_party_click / asset_download / consult_click / ai_chat_open / ladder_click
  props       jsonb default '{}'::jsonb,
  path        text,
  channel     text,                   -- 来源渠道（与 leads.channel 同枚举）
  referrer    text,
  created_at  timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_event_idx on public.events (event);

-- 加列（幂等）：让已有库也能直接用
alter table public.events add column if not exists props jsonb default '{}'::jsonb;
alter table public.events add column if not exists path text;
alter table public.events add column if not exists channel text;
alter table public.events add column if not exists referrer text;

alter table public.events enable row level security;

-- 只允许 service_role 读写（前端走 /api/track，不直接连库）
drop policy if exists "events_service_all" on public.events;
create policy "events_service_all" on public.events
  for all
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- 看板常用查询（可直接在 SQL Editor 里跑）
-- ============================================================
-- 1) 每日留资数
-- select date_trunc('day', created_at)::date as day, count(*)
-- from public.leads group by 1 order by 1 desc limit 30;

-- 2) 事件漏斗（以线索数为分母）
-- select event, count(*) as cnt
-- from public.events group by event order by cnt desc;

-- 3) 来源分布
-- select channel, count(*) from public.leads group by channel order by 2 desc;
