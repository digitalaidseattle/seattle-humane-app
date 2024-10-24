-- make new status col in service_requests and fill it up
ALTER TABLE ONLY "public"."service_requests"
ADD COLUMN "request_source_uuid" uuid;

-- delete old status col and replace with new
ALTER TABLE ONLY "public"."service_requests"
DROP COLUMN "request_source";

ALTER TABLE ONLY "public"."service_requests"
RENAME COLUMN "request_source_uuid" to "request_source";

ALTER TABLE ONLY "public"."service_requests"
ALTER COLUMN "request_source" SET NOT NULL;

ALTER TABLE ONLY "public"."service_requests"
ADD CONSTRAINT "request_source_fkey"
FOREIGN KEY ("request_source")
REFERENCES "public"."app_constants"("id");