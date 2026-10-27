-- 0002: leads 增加来源页面字段（提交表单时的完整 URL，用于追溯落地页）
alter table public.leads add column if not exists source text;

comment on column public.leads.source is '提交表单时的页面 URL';
