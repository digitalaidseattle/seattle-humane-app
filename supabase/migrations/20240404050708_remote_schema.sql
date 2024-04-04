alter table "public"."clients" drop column "phone";

alter table "public"."clients" drop column "postal_code";

alter table "public"."clients" drop column "previously_used";

alter table "public"."clients" add column "phone_number" text;

alter table "public"."clients" add column "zip_code" text;


