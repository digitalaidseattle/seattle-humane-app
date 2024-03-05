create table
  public.app_constants (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    label character varying null,
    value character varying null,
    type character varying null,
    constraint app_constants_pkey primary key (id)
  ) tablespace pg_default;


grant select, insert, update, delete on table "public"."APP_CONSTANTS" to "anon";
grant select, insert, update, delete on table "public"."APP_CONSTANTS" to "authenticated";
grant select, insert, update, delete on table "public"."APP_CONSTANTS" to "service_role";

