revoke delete on table "public"."pets" from "anon";

revoke insert on table "public"."pets" from "anon";

revoke references on table "public"."pets" from "anon";

revoke select on table "public"."pets" from "anon";

revoke trigger on table "public"."pets" from "anon";

revoke truncate on table "public"."pets" from "anon";

revoke update on table "public"."pets" from "anon";

revoke delete on table "public"."pets" from "authenticated";

revoke insert on table "public"."pets" from "authenticated";

revoke references on table "public"."pets" from "authenticated";

revoke select on table "public"."pets" from "authenticated";

revoke trigger on table "public"."pets" from "authenticated";

revoke truncate on table "public"."pets" from "authenticated";

revoke update on table "public"."pets" from "authenticated";

revoke delete on table "public"."pets" from "service_role";

revoke insert on table "public"."pets" from "service_role";

revoke references on table "public"."pets" from "service_role";

revoke select on table "public"."pets" from "service_role";

revoke trigger on table "public"."pets" from "service_role";

revoke truncate on table "public"."pets" from "service_role";

revoke update on table "public"."pets" from "service_role";

alter table "public"."pets" drop constraint "pets_pkey";

drop index if exists "public"."pets_pkey";

drop table "public"."pets";

create table "public"."Employee" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "first_name" character varying not null,
    "last_name" character varying not null,
    "email" character varying not null,
    "role" text[] not null
);


alter table "public"."Employee" enable row level security;

create table "public"."clients" (
    "id" uuid not null default uuid_generate_v4(),
    "first_name" character varying(255),
    "last_name" character varying(255),
    "phone_number" character varying(20),
    "email" character varying(255)
);


create table "public"."service_category" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text
);


CREATE UNIQUE INDEX "Employee_email_key" ON public."Employee" USING btree (email);

CREATE UNIQUE INDEX "Employee_pkey" ON public."Employee" USING btree (id);

CREATE UNIQUE INDEX clients_email_key ON public.clients USING btree (email);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX service_category_pkey ON public.service_category USING btree (id);

alter table "public"."Employee" add constraint "Employee_pkey" PRIMARY KEY using index "Employee_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."service_category" add constraint "service_category_pkey" PRIMARY KEY using index "service_category_pkey";

alter table "public"."Employee" add constraint "Employee_email_key" UNIQUE using index "Employee_email_key";

alter table "public"."Employee" add constraint "Employee_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."Employee" validate constraint "Employee_id_fkey";

alter table "public"."clients" add constraint "clients_email_key" UNIQUE using index "clients_email_key";

grant delete on table "public"."Employee" to "anon";

grant insert on table "public"."Employee" to "anon";

grant references on table "public"."Employee" to "anon";

grant select on table "public"."Employee" to "anon";

grant trigger on table "public"."Employee" to "anon";

grant truncate on table "public"."Employee" to "anon";

grant update on table "public"."Employee" to "anon";

grant delete on table "public"."Employee" to "authenticated";

grant insert on table "public"."Employee" to "authenticated";

grant references on table "public"."Employee" to "authenticated";

grant select on table "public"."Employee" to "authenticated";

grant trigger on table "public"."Employee" to "authenticated";

grant truncate on table "public"."Employee" to "authenticated";

grant update on table "public"."Employee" to "authenticated";

grant delete on table "public"."Employee" to "service_role";

grant insert on table "public"."Employee" to "service_role";

grant references on table "public"."Employee" to "service_role";

grant select on table "public"."Employee" to "service_role";

grant trigger on table "public"."Employee" to "service_role";

grant truncate on table "public"."Employee" to "service_role";

grant update on table "public"."Employee" to "service_role";

grant delete on table "public"."clients" to "anon";

grant insert on table "public"."clients" to "anon";

grant references on table "public"."clients" to "anon";

grant select on table "public"."clients" to "anon";

grant trigger on table "public"."clients" to "anon";

grant truncate on table "public"."clients" to "anon";

grant update on table "public"."clients" to "anon";

grant delete on table "public"."clients" to "authenticated";

grant insert on table "public"."clients" to "authenticated";

grant references on table "public"."clients" to "authenticated";

grant select on table "public"."clients" to "authenticated";

grant trigger on table "public"."clients" to "authenticated";

grant truncate on table "public"."clients" to "authenticated";

grant update on table "public"."clients" to "authenticated";

grant delete on table "public"."clients" to "service_role";

grant insert on table "public"."clients" to "service_role";

grant references on table "public"."clients" to "service_role";

grant select on table "public"."clients" to "service_role";

grant trigger on table "public"."clients" to "service_role";

grant truncate on table "public"."clients" to "service_role";

grant update on table "public"."clients" to "service_role";

grant delete on table "public"."service_category" to "anon";

grant insert on table "public"."service_category" to "anon";

grant references on table "public"."service_category" to "anon";

grant select on table "public"."service_category" to "anon";

grant trigger on table "public"."service_category" to "anon";

grant truncate on table "public"."service_category" to "anon";

grant update on table "public"."service_category" to "anon";

grant delete on table "public"."service_category" to "authenticated";

grant insert on table "public"."service_category" to "authenticated";

grant references on table "public"."service_category" to "authenticated";

grant select on table "public"."service_category" to "authenticated";

grant trigger on table "public"."service_category" to "authenticated";

grant truncate on table "public"."service_category" to "authenticated";

grant update on table "public"."service_category" to "authenticated";

grant delete on table "public"."service_category" to "service_role";

grant insert on table "public"."service_category" to "service_role";

grant references on table "public"."service_category" to "service_role";

grant select on table "public"."service_category" to "service_role";

grant trigger on table "public"."service_category" to "service_role";

grant truncate on table "public"."service_category" to "service_role";

grant update on table "public"."service_category" to "service_role";


