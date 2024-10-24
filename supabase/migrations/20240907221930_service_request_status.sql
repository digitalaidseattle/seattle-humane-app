-- make new status col in service_requests and fill it up
ALTER TABLE ONLY "public"."service_requests"
ADD COLUMN "status_uuid" uuid;

-- delete old status col and replace with new
ALTER TABLE ONLY "public"."service_requests"
DROP COLUMN "status";

ALTER TABLE ONLY "public"."service_requests"
RENAME COLUMN "status_uuid" to "status";

ALTER TABLE ONLY "public"."service_requests"
ALTER COLUMN "status" SET NOT NULL;

ALTER TABLE ONLY "public"."service_requests"
ADD CONSTRAINT "public_service_requests_status_fkey"
FOREIGN KEY ("status")
REFERENCES "public"."app_constants"("id");