
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."app_constants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" character varying NOT NULL,
    "value" character varying NOT NULL,
    "type" character varying NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "changed_by" character varying DEFAULT 'sam.henderson@digitalaidseattle.org'::character varying NOT NULL
);

ALTER TABLE "public"."app_constants" OWNER TO "postgres";

COMMENT ON TABLE "public"."app_constants" IS 'Application Constants';

CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone" "text",
    "postal_code" "text",
    "previously_used" "text"
);

ALTER TABLE "public"."clients" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."pets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "species_id" "uuid",
    "age" integer,
    "weight" integer,
    "client_id" "uuid"
);

ALTER TABLE "public"."pets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."request_sources" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text"
);

ALTER TABLE "public"."request_sources" OWNER TO "postgres";

COMMENT ON TABLE "public"."request_sources" IS 'Constants for source of request';

CREATE TABLE IF NOT EXISTS "public"."service_categories" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text"
);

ALTER TABLE "public"."service_categories" OWNER TO "postgres";

COMMENT ON TABLE "public"."service_categories" IS 'Constants for service categories NEW';

CREATE TABLE IF NOT EXISTS "public"."service_category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text",
    "value" character varying
);

ALTER TABLE "public"."service_category" OWNER TO "postgres";

COMMENT ON TABLE "public"."service_category" IS 'Constants for service categories';

CREATE TABLE IF NOT EXISTS "public"."service_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "service_category_id" "uuid",
    "request_source_id" "uuid",
    "description" "text",
    "pet_id" "uuid",
    "client_id" "uuid",
    "team_member_id" "uuid",
    "log_id" "uuid" DEFAULT "gen_random_uuid"()
);

ALTER TABLE "public"."service_requests" OWNER TO "postgres";

COMMENT ON TABLE "public"."service_requests" IS 'Central data type - all service requests';

CREATE TABLE IF NOT EXISTS "public"."species" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "label" "text"
);

ALTER TABLE "public"."species" OWNER TO "postgres";

COMMENT ON TABLE "public"."species" IS 'Constants for all types of species';

CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text"
);

ALTER TABLE "public"."team_members" OWNER TO "postgres";

COMMENT ON TABLE "public"."team_members" IS 'All team members (for task assignment, not auth)';

ALTER TABLE ONLY "public"."app_constants"
    ADD CONSTRAINT "app_constants_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "pets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."service_categories"
    ADD CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."service_category"
    ADD CONSTRAINT "service_category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "service_request_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_sources"
    ADD CONSTRAINT "source_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."species"
    ADD CONSTRAINT "species_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "public_pets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");

ALTER TABLE ONLY "public"."pets"
    ADD CONSTRAINT "public_pets_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "public"."app_constants"("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "public_service_requests_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "public_service_requests_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "public_service_requests_request_source_id_fkey" FOREIGN KEY ("request_source_id") REFERENCES "public"."app_constants"("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "public_service_requests_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "public"."app_constants"("id");

ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "public_service_requests_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id");

ALTER TABLE "public"."request_sources" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."service_categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."species" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."app_constants" TO "anon";
GRANT ALL ON TABLE "public"."app_constants" TO "authenticated";
GRANT ALL ON TABLE "public"."app_constants" TO "service_role";

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";

GRANT ALL ON TABLE "public"."pets" TO "anon";
GRANT ALL ON TABLE "public"."pets" TO "authenticated";
GRANT ALL ON TABLE "public"."pets" TO "service_role";

GRANT ALL ON TABLE "public"."request_sources" TO "anon";
GRANT ALL ON TABLE "public"."request_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."request_sources" TO "service_role";

GRANT ALL ON TABLE "public"."service_categories" TO "anon";
GRANT ALL ON TABLE "public"."service_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."service_categories" TO "service_role";

GRANT ALL ON TABLE "public"."service_category" TO "anon";
GRANT ALL ON TABLE "public"."service_category" TO "authenticated";
GRANT ALL ON TABLE "public"."service_category" TO "service_role";

GRANT ALL ON TABLE "public"."service_requests" TO "anon";
GRANT ALL ON TABLE "public"."service_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."service_requests" TO "service_role";

GRANT ALL ON TABLE "public"."species" TO "anon";
GRANT ALL ON TABLE "public"."species" TO "authenticated";
GRANT ALL ON TABLE "public"."species" TO "service_role";

GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
