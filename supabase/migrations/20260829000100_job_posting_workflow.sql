begin;

create table public.job_templates (
  id uuid primary key default gen_random_uuid(),
  template_name text not null check (char_length(btrim(template_name)) between 1 and 120),
  job_title text not null check (char_length(btrim(job_title)) between 1 and 160),
  job_description text not null check (char_length(btrim(job_description)) between 1 and 10000),
  job_duties text not null check (char_length(btrim(job_duties)) between 1 and 10000),
  experience_required text not null check (char_length(btrim(experience_required)) between 1 and 10000),
  schedule text not null check (char_length(btrim(schedule)) between 1 and 2000),
  location text not null check (char_length(btrim(location)) between 1 and 500),
  pay_range text check (pay_range is null or char_length(pay_range) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.job_templates(id) on delete set null,
  job_title text not null check (char_length(btrim(job_title)) between 1 and 160),
  job_description text not null check (char_length(btrim(job_description)) between 1 and 10000),
  job_duties text not null check (char_length(btrim(job_duties)) between 1 and 10000),
  experience_required text not null check (char_length(btrim(experience_required)) between 1 and 10000),
  schedule text not null check (char_length(btrim(schedule)) between 1 and 2000),
  location text not null check (char_length(btrim(location)) between 1 and 500),
  pay_range text check (pay_range is null or char_length(pay_range) <= 500),
  status text not null default 'draft' check (status in ('draft', 'open', 'filled', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  filled_at timestamptz,
  closed_at timestamptz,
  constraint job_postings_status_timestamps check (
    (status <> 'open' or published_at is not null)
    and (status <> 'filled' or filled_at is not null)
    and (status <> 'closed' or closed_at is not null)
  )
);

alter table public.employment_applications
  add column job_posting_id uuid references public.job_postings(id) on delete set null;

create index job_postings_public_status_published_idx
  on public.job_postings (status, published_at desc)
  where status = 'open';
create index job_postings_template_id_idx on public.job_postings (template_id);
create index employment_applications_job_posting_id_idx
  on public.employment_applications (job_posting_id)
  where job_posting_id is not null;

create or replace function public.set_job_management_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_job_templates_updated_at
before update on public.job_templates
for each row execute function public.set_job_management_updated_at();

create trigger set_job_postings_updated_at
before update on public.job_postings
for each row execute function public.set_job_management_updated_at();

alter table public.job_templates enable row level security;
alter table public.job_templates force row level security;
alter table public.job_postings enable row level security;
alter table public.job_postings force row level security;

revoke all on table public.job_templates from anon, authenticated;
revoke all on table public.job_postings from anon, authenticated;
grant select on table public.job_postings to anon, authenticated;
grant all on table public.job_templates to service_role;
grant all on table public.job_postings to service_role;

create policy "Public can read open job postings"
on public.job_postings
for select
to anon, authenticated
using (status = 'open');

revoke all on function public.set_job_management_updated_at() from public, anon, authenticated;
grant execute on function public.set_job_management_updated_at() to service_role;

comment on table public.job_templates is 'Private reusable Axe job-content templates.';
comment on table public.job_postings is 'Public-when-open and historical Axe employment postings.';
comment on column public.employment_applications.job_posting_id is
  'Optional posting context captured when an applicant applies from a public job page.';

commit;
