alter table "public"."clients" drop column "phone_number";

alter table "public"."clients" drop column "zip_code";

alter table "public"."clients" add column "phone" text;

alter table "public"."clients" add column "postal_code" text;

alter table "public"."clients" add column "previously_used" text;