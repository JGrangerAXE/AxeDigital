begin;

create table public.employment_applications (
  id uuid primary key,
  submitted_at timestamptz not null,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text not null check (char_length(phone) between 1 and 50),
  email text not null check (char_length(email) between 3 and 254),
  career_area text not null check (
    career_area in (
      'Construction',
      'Welding & Fabrication',
      'Machine Operation',
      'Painting & Coatings',
      'General Application'
    )
  ),
  relevant_experience text not null check (char_length(relevant_experience) between 1 and 5000),
  preferred_contact_method text not null check (
    preferred_contact_method in ('Phone call', 'Text message', 'Email')
  ),
  best_time_to_contact text not null check (char_length(best_time_to_contact) between 1 and 120),
  optional_message text check (optional_message is null or char_length(optional_message) <= 5000),
  resume_storage_path text,
  resume_original_filename text,
  resume_mime_type text,
  resume_size_bytes bigint check (resume_size_bytes is null or resume_size_bytes between 1 and 5242880),
  application_status text not null default 'new' check (application_status in ('new')),
  email_delivery_status text not null default 'pending' check (
    email_delivery_status in ('pending', 'sent', 'failed')
  ),
  email_delivery_attempted_at timestamptz,
  email_delivered_at timestamptz,
  email_provider_message_id text,
  email_error_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employment_applications_resume_metadata_complete check (
    (
      resume_storage_path is null
      and resume_original_filename is null
      and resume_mime_type is null
      and resume_size_bytes is null
    )
    or
    (
      resume_storage_path is not null
      and resume_original_filename is not null
      and resume_mime_type is not null
      and resume_size_bytes is not null
    )
  ),
  constraint employment_applications_email_delivery_consistent check (
    (email_delivery_status = 'pending' and email_delivered_at is null)
    or (email_delivery_status = 'failed' and email_delivery_attempted_at is not null and email_delivered_at is null)
    or (email_delivery_status = 'sent' and email_delivery_attempted_at is not null and email_delivered_at is not null)
  )
);

comment on table public.employment_applications is
  'Private initial-interest employment applications submitted through the Axe Digital website.';

create or replace function public.set_employment_applications_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_employment_applications_updated_at
before update on public.employment_applications
for each row
execute function public.set_employment_applications_updated_at();

alter table public.employment_applications enable row level security;
alter table public.employment_applications force row level security;

revoke all on table public.employment_applications from anon, authenticated;
grant all on table public.employment_applications to service_role;

revoke all on function public.set_employment_applications_updated_at() from public, anon, authenticated;
grant execute on function public.set_employment_applications_updated_at() to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'employment-resumes',
  'employment-resumes',
  false,
  5242880,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No anon or authenticated policies are created for the table or bucket.
-- The website route uses the server-only service-role client.

commit;
