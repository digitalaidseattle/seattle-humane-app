create table "public"."pets" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "weight" double precision not null,
    "year" smallint not null,
    "months" smallint not null,
    "breed" text not null,
    "sex" text not null,
    "color" text not null,
    "neutered/spayed" boolean not null
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


