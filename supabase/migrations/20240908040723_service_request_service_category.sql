-- make new status col in service_requests and fill it up
ALTER TABLE ONLY "public"."service_requests"
ADD COLUMN "service_category_uuid" uuid;

-- delete old status col and replace with new
ALTER TABLE ONLY "public"."service_requests"
DROP COLUMN "service_category";

ALTER TABLE ONLY "public"."service_requests"
RENAME COLUMN "service_category_uuid" to "service_category";

ALTER TABLE ONLY "public"."service_requests"
ALTER COLUMN "service_category" SET NOT NULL;

ALTER TABLE ONLY "public"."service_requests"
ADD CONSTRAINT "public_service_requests_service_category_fkey"
FOREIGN KEY ("service_category")
REFERENCES "public"."app_constants"("id");