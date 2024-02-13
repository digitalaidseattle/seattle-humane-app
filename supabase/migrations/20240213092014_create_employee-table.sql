create table "public"."Employee" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "first_name" character varying not null,
    "last_name" character varying not null,
    "email" character varying not null,
    "role" text[] not null
);


alter table "public"."Employee" enable row level security;

CREATE UNIQUE INDEX "Employee_email_key" ON public."Employee" USING btree (email);

CREATE UNIQUE INDEX "Employee_pkey" ON public."Employee" USING btree (id);

alter table "public"."Employee" add constraint "Employee_pkey" PRIMARY KEY using index "Employee_pkey";

alter table "public"."Employee" add constraint "Employee_email_key" UNIQUE using index "Employee_email_key";

alter table "public"."Employee" add constraint "Employee_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."Employee" validate constraint "Employee_id_fkey";

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


