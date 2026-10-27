/* ============================================================
   0005 · 线索归因字段：leads.identity + leads.utm_source

   背景：成交与交付在第三方平台完成，官网唯一要沉淀的就是**线索**。
   后台按「身份」和「来源」两个维度筛线索、做每周分类导出，
   所以把这两个字段从 role / utm(jsonb) 里冗余出来，直接可筛选。

   说明：role / utm(jsonb) / channel 三个旧字段全部保留，兼容旧后台。
   全文件 IF NOT EXISTS，可重复执行。
   执行顺序：0001 → 0005 → 0006
   ============================================================ */

alter table public.leads add column if not exists identity   text;
alter table public.leads add column if not exists utm_source text;

comment on column public.leads.identity   is '访客身份：修理厂 / 汽配商 / 平台企业 / AI公司 / 其他';
comment on column public.leads.utm_source is '首次落地的 utm_source 明文，便于后台直接筛选来源';

create index if not exists idx_leads_identity   on public.leads (identity);
create index if not exists idx_leads_utm_source on public.leads (utm_source);

/* ------------------------------------------------------------
   写入时自动补齐：不管是谁写的 leads（API / SQL / 导入），
   这两列都不会是空的——后台筛选才不会漏数据。
   identity   ← role
   utm_source ← utm.utm_source → channel → direct
   ------------------------------------------------------------ */
create or replace function public.leads_set_attribution()
returns trigger
language plpgsql
as $$
begin
  if new.identity is null then
    new.identity := coalesce(nullif(new.role, ''), '其他');
  end if;
  if new.utm_source is null then
    new.utm_source := coalesce(
      nullif(new.utm ->> 'utm_source', ''),
      nullif(new.channel, ''),
      'direct'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_leads_attribution on public.leads;
create trigger trg_leads_attribution
  before insert on public.leads
  for each row execute function public.leads_set_attribution();

/* 回填历史数据 */
update public.leads set identity = coalesce(nullif(role, ''), '其他') where identity is null;
update public.leads
   set utm_source = coalesce(nullif(utm ->> 'utm_source', ''), nullif(channel, ''), 'direct')
 where utm_source is null;
