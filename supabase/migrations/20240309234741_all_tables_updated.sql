create table "public"."app_constants" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "label" character varying,
    "value" character varying,
    "type" character varying
);


create table "public"."clients" (
    "id" uuid not null default uuid_generate_v4(),
    "email" text,
    "first_name" text,
    "last_name" text,
    "phone" text,
    "postal_code" text,
    "previously_used" text
);


create table "public"."request_sources" (
    "id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "label" text
);


alter table "public"."request_sources" enable row level security;

create table "public"."service_categories" (
    "id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "label" text
);


alter table "public"."service_categories" enable row level security;

create table "public"."service_category" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "label" text,
    "value" character varying
);


create table "public"."service_requests" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "service_category_id" text,
    "request_source_id" character varying,
    "description" text,
    "pet_id" uuid,
    "client_id" uuid,
    "team_member_id" uuid default gen_random_uuid(),
    "log_id" uuid default gen_random_uuid()
);


create table "public"."species" (
    "id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "label" text
);


alter table "public"."species" enable row level security;

create table "public"."team_members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "first_name" text,
    "last_name" text,
    "email" text
);


alter table "public"."team_members" enable row level security;

alter table "public"."pets" drop column "species";

alter table "public"."pets" add column "client_id" uuid;

alter table "public"."pets" add column "species_id" text;

CREATE UNIQUE INDEX app_constants_pkey ON public.app_constants USING btree (id);

CREATE UNIQUE INDEX clients_email_key ON public.clients USING btree (email);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX service_categories_pkey ON public.service_categories USING btree (id);

CREATE UNIQUE INDEX service_category_pkey ON public.service_category USING btree (id);

CREATE UNIQUE INDEX service_request_pkey ON public.service_requests USING btree (id);

CREATE UNIQUE INDEX source_types_pkey ON public.request_sources USING btree (id);

CREATE UNIQUE INDEX species_types_pkey ON public.species USING btree (id);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (id);

alter table "public"."app_constants" add constraint "app_constants_pkey" PRIMARY KEY using index "app_constants_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."request_sources" add constraint "source_types_pkey" PRIMARY KEY using index "source_types_pkey";

alter table "public"."service_categories" add constraint "service_categories_pkey" PRIMARY KEY using index "service_categories_pkey";

alter table "public"."service_category" add constraint "service_category_pkey" PRIMARY KEY using index "service_category_pkey";

alter table "public"."service_requests" add constraint "service_request_pkey" PRIMARY KEY using index "service_request_pkey";

alter table "public"."species" add constraint "species_types_pkey" PRIMARY KEY using index "species_types_pkey";

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."clients" add constraint "clients_email_key" UNIQUE using index "clients_email_key";

alter table "public"."pets" add constraint "public_pets_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."pets" validate constraint "public_pets_client_id_fkey";

alter table "public"."pets" add constraint "public_pets_species_id_fkey" FOREIGN KEY (species_id) REFERENCES species(id) not valid;

alter table "public"."pets" validate constraint "public_pets_species_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_client_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES pets(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_pet_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_request_source_id_fkey" FOREIGN KEY (request_source_id) REFERENCES request_sources(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_request_source_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_service_category_id_fkey" FOREIGN KEY (service_category_id) REFERENCES service_categories(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_service_category_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_team_member_id_fkey" FOREIGN KEY (team_member_id) REFERENCES team_members(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_team_member_id_fkey";

grant delete on table "public"."app_constants" to "anon";

grant insert on table "public"."app_constants" to "anon";

grant references on table "public"."app_constants" to "anon";

grant select on table "public"."app_constants" to "anon";

grant trigger on table "public"."app_constants" to "anon";

grant truncate on table "public"."app_constants" to "anon";

grant update on table "public"."app_constants" to "anon";

grant delete on table "public"."app_constants" to "authenticated";

grant insert on table "public"."app_constants" to "authenticated";

grant references on table "public"."app_constants" to "authenticated";

grant select on table "public"."app_constants" to "authenticated";

grant trigger on table "public"."app_constants" to "authenticated";

grant truncate on table "public"."app_constants" to "authenticated";

grant update on table "public"."app_constants" to "authenticated";

grant delete on table "public"."app_constants" to "service_role";

grant insert on table "public"."app_constants" to "service_role";

grant references on table "public"."app_constants" to "service_role";

grant select on table "public"."app_constants" to "service_role";

grant trigger on table "public"."app_constants" to "service_role";

grant truncate on table "public"."app_constants" to "service_role";

grant update on table "public"."app_constants" to "service_role";

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

grant delete on table "public"."request_sources" to "anon";

grant insert on table "public"."request_sources" to "anon";

grant references on table "public"."request_sources" to "anon";

grant select on table "public"."request_sources" to "anon";

grant trigger on table "public"."request_sources" to "anon";

grant truncate on table "public"."request_sources" to "anon";

grant update on table "public"."request_sources" to "anon";

grant delete on table "public"."request_sources" to "authenticated";

grant insert on table "public"."request_sources" to "authenticated";

grant references on table "public"."request_sources" to "authenticated";

grant select on table "public"."request_sources" to "authenticated";

grant trigger on table "public"."request_sources" to "authenticated";

grant truncate on table "public"."request_sources" to "authenticated";

grant update on table "public"."request_sources" to "authenticated";

grant delete on table "public"."request_sources" to "service_role";

grant insert on table "public"."request_sources" to "service_role";

grant references on table "public"."request_sources" to "service_role";

grant select on table "public"."request_sources" to "service_role";

grant trigger on table "public"."request_sources" to "service_role";

grant truncate on table "public"."request_sources" to "service_role";

grant update on table "public"."request_sources" to "service_role";

grant delete on table "public"."service_categories" to "anon";

grant insert on table "public"."service_categories" to "anon";

grant references on table "public"."service_categories" to "anon";

grant select on table "public"."service_categories" to "anon";

grant trigger on table "public"."service_categories" to "anon";

grant truncate on table "public"."service_categories" to "anon";

grant update on table "public"."service_categories" to "anon";

grant delete on table "public"."service_categories" to "authenticated";

grant insert on table "public"."service_categories" to "authenticated";

grant references on table "public"."service_categories" to "authenticated";

grant select on table "public"."service_categories" to "authenticated";

grant trigger on table "public"."service_categories" to "authenticated";

grant truncate on table "public"."service_categories" to "authenticated";

grant update on table "public"."service_categories" to "authenticated";

grant delete on table "public"."service_categories" to "service_role";

grant insert on table "public"."service_categories" to "service_role";

grant references on table "public"."service_categories" to "service_role";

grant select on table "public"."service_categories" to "service_role";

grant trigger on table "public"."service_categories" to "service_role";

grant truncate on table "public"."service_categories" to "service_role";

grant update on table "public"."service_categories" to "service_role";

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

grant delete on table "public"."service_requests" to "anon";

grant insert on table "public"."service_requests" to "anon";

grant references on table "public"."service_requests" to "anon";

grant select on table "public"."service_requests" to "anon";

grant trigger on table "public"."service_requests" to "anon";

grant truncate on table "public"."service_requests" to "anon";

grant update on table "public"."service_requests" to "anon";

grant delete on table "public"."service_requests" to "authenticated";

grant insert on table "public"."service_requests" to "authenticated";

grant references on table "public"."service_requests" to "authenticated";

grant select on table "public"."service_requests" to "authenticated";

grant trigger on table "public"."service_requests" to "authenticated";

grant truncate on table "public"."service_requests" to "authenticated";

grant update on table "public"."service_requests" to "authenticated";

grant delete on table "public"."service_requests" to "service_role";

grant insert on table "public"."service_requests" to "service_role";

grant references on table "public"."service_requests" to "service_role";

grant select on table "public"."service_requests" to "service_role";

grant trigger on table "public"."service_requests" to "service_role";

grant truncate on table "public"."service_requests" to "service_role";

grant update on table "public"."service_requests" to "service_role";

grant delete on table "public"."species" to "anon";

grant insert on table "public"."species" to "anon";

grant references on table "public"."species" to "anon";

grant select on table "public"."species" to "anon";

grant trigger on table "public"."species" to "anon";

grant truncate on table "public"."species" to "anon";

grant update on table "public"."species" to "anon";

grant delete on table "public"."species" to "authenticated";

grant insert on table "public"."species" to "authenticated";

grant references on table "public"."species" to "authenticated";

grant select on table "public"."species" to "authenticated";

grant trigger on table "public"."species" to "authenticated";

grant truncate on table "public"."species" to "authenticated";

grant update on table "public"."species" to "authenticated";

grant delete on table "public"."species" to "service_role";

grant insert on table "public"."species" to "service_role";

grant references on table "public"."species" to "service_role";

grant select on table "public"."species" to "service_role";

grant trigger on table "public"."species" to "service_role";

grant truncate on table "public"."species" to "service_role";

grant update on table "public"."species" to "service_role";

grant delete on table "public"."team_members" to "anon";

grant insert on table "public"."team_members" to "anon";

grant references on table "public"."team_members" to "anon";

grant select on table "public"."team_members" to "anon";

grant trigger on table "public"."team_members" to "anon";

grant truncate on table "public"."team_members" to "anon";

grant update on table "public"."team_members" to "anon";

grant delete on table "public"."team_members" to "authenticated";

grant insert on table "public"."team_members" to "authenticated";

grant references on table "public"."team_members" to "authenticated";

grant select on table "public"."team_members" to "authenticated";

grant trigger on table "public"."team_members" to "authenticated";

grant truncate on table "public"."team_members" to "authenticated";

grant update on table "public"."team_members" to "authenticated";

grant delete on table "public"."team_members" to "service_role";

grant insert on table "public"."team_members" to "service_role";

grant references on table "public"."team_members" to "service_role";

grant select on table "public"."team_members" to "service_role";

grant trigger on table "public"."team_members" to "service_role";

grant truncate on table "public"."team_members" to "service_role";

grant update on table "public"."team_members" to "service_role";


