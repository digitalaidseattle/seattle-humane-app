alter table "public"."pets" drop constraint "public_pets_species_id_fkey";

alter table "public"."service_requests" drop constraint "public_service_requests_request_source_id_fkey";

alter table "public"."service_requests" drop constraint "public_service_requests_service_category_id_fkey";

alter table "public"."app_constants" add column "active" boolean not null default true;

alter table "public"."app_constants" add column "changed_at" timestamp with time zone not null;

alter table "public"."app_constants" add column "changed_by" character varying not null default 'sam.henderson@digitalaidseattle.org'::character varying;

alter table "public"."app_constants" alter column "label" set not null;

alter table "public"."app_constants" alter column "type" set not null;

alter table "public"."app_constants" alter column "value" set not null;

alter table "public"."pets" alter column "species_id" set default gen_random_uuid();

alter table "public"."pets" alter column "species_id" set data type uuid using "species_id"::uuid;

alter table "public"."service_requests" alter column "request_source_id" set default gen_random_uuid();

alter table "public"."service_requests" alter column "request_source_id" set data type uuid using "request_source_id"::uuid;

alter table "public"."service_requests" alter column "service_category_id" set default gen_random_uuid();

alter table "public"."service_requests" alter column "service_category_id" set data type uuid using "service_category_id"::uuid;

alter table "public"."pets" add constraint "public_pets_species_id_fkey" FOREIGN KEY (species_id) REFERENCES app_constants(id) not valid;

alter table "public"."pets" validate constraint "public_pets_species_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_request_source_id_fkey" FOREIGN KEY (request_source_id) REFERENCES app_constants(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_request_source_id_fkey";

alter table "public"."service_requests" add constraint "public_service_requests_service_category_id_fkey" FOREIGN KEY (service_category_id) REFERENCES app_constants(id) not valid;

alter table "public"."service_requests" validate constraint "public_service_requests_service_category_id_fkey";


