ALTER TABLE ONLY "public"."service_requests"
    DROP CONSTRAINT "public_service_requests_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "public"."app_constants"("id");

ALTER TABLE ONLY "public"."service_requests"
    DROP CONSTRAINT "public_service_requests_request_source_id_fkey" FOREIGN KEY ("request_source_id") REFERENCES "public"."app_constants"("id");

ALTER TABLE ONLY "public"."service_requests"
    DROP COLUMN "log_id";

ALTER TABLE ONLY "public"."service_requests"
    ADD COLUMN "service_category" text;    

ALTER TABLE ONLY "public"."service_requests"
    ADD COLUMN "request_source" text;    

ALTER TABLE ONLY "public"."service_requests"
    ADD COLUMN "status" text;    

CREATE TABLE IF NOT EXISTS "public"."service_request_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "service_request_id" "uuid",
    "team_member_id" "uuid",
    "description" "text"
);

ALTER TABLE "public"."service_request_history" OWNER TO "postgres";

ALTER TABLE ONLY "public"."service_request_history"
    ADD CONSTRAINT "public_service_request_history_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id");

GRANT ALL ON TABLE "public"."service_request_history" TO "anon";
GRANT ALL ON TABLE "public"."service_request_history" TO "authenticated";
GRANT ALL ON TABLE "public"."service_request_history" TO "service_role";
