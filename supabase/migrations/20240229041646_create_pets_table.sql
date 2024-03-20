revoke delete on table "public"."Employee" from "anon";

revoke insert on table "public"."Employee" from "anon";

revoke references on table "public"."Employee" from "anon";

revoke select on table "public"."Employee" from "anon";

revoke trigger on table "public"."Employee" from "anon";

revoke truncate on table "public"."Employee" from "anon";

revoke update on table "public"."Employee" from "anon";

revoke delete on table "public"."Employee" from "authenticated";

revoke insert on table "public"."Employee" from "authenticated";

revoke references on table "public"."Employee" from "authenticated";

revoke select on table "public"."Employee" from "authenticated";

revoke trigger on table "public"."Employee" from "authenticated";

revoke truncate on table "public"."Employee" from "authenticated";

revoke update on table "public"."Employee" from "authenticated";

revoke delete on table "public"."Employee" from "service_role";

revoke insert on table "public"."Employee" from "service_role";

revoke references on table "public"."Employee" from "service_role";

revoke select on table "public"."Employee" from "service_role";

revoke trigger on table "public"."Employee" from "service_role";

revoke truncate on table "public"."Employee" from "service_role";

revoke update on table "public"."Employee" from "service_role";

alter table "public"."Employee" drop constraint "Employee_email_key";

alter table "public"."Employee" drop constraint "Employee_id_fkey";

alter table "public"."Employee" drop constraint "Employee_pkey";

drop index if exists "public"."Employee_email_key";

drop index if exists "public"."Employee_pkey";

drop table "public"."Employee";

create table "public"."pets" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "species" text,
    "age" integer,
    "weight" integer
);


alter table "public"."pets" enable row level security;

CREATE UNIQUE INDEX pets_pkey ON public.pets USING btree (id);

alter table "public"."pets" add constraint "pets_pkey" PRIMARY KEY using index "pets_pkey";

grant delete on table "public"."pets" to "anon";

grant insert on table "public"."pets" to "anon";

grant references on table "public"."pets" to "anon";

grant select on table "public"."pets" to "anon";

grant trigger on table "public"."pets" to "anon";

grant truncate on table "public"."pets" to "anon";

grant update on table "public"."pets" to "anon";

grant delete on table "public"."pets" to "authenticated";

grant insert on table "public"."pets" to "authenticated";

grant references on table "public"."pets" to "authenticated";

grant select on table "public"."pets" to "authenticated";

grant trigger on table "public"."pets" to "authenticated";

grant truncate on table "public"."pets" to "authenticated";

grant update on table "public"."pets" to "authenticated";

grant delete on table "public"."pets" to "service_role";

grant insert on table "public"."pets" to "service_role";

grant references on table "public"."pets" to "service_role";

grant select on table "public"."pets" to "service_role";

grant trigger on table "public"."pets" to "service_role";

grant truncate on table "public"."pets" to "service_role";

grant update on table "public"."pets" to "service_role";


