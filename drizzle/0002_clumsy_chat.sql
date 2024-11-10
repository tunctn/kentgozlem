CREATE TYPE "public"."report_status" AS ENUM('pending', 'investigating', 'rejected', 'resolved');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_audits" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"report_id" text NOT NULL,
	"status" "report_status" NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_id" text,
	"review_note" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_images" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"report_id" text NOT NULL,
	"image_url" varchar NOT NULL,
	"size" integer NOT NULL,
	"extension" varchar NOT NULL,
	"file_name" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"description" text,
	"order" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"category_id" text NOT NULL,
	"address" varchar(255) NOT NULL,
	"description" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_audits" ADD CONSTRAINT "report_audits_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_audits" ADD CONSTRAINT "report_audits_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_audits" ADD CONSTRAINT "report_audits_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_audits" ADD CONSTRAINT "report_audits_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_images" ADD CONSTRAINT "report_images_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_images" ADD CONSTRAINT "report_images_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "report_images" ADD CONSTRAINT "report_images_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_audits_report_id_idx" ON "report_audits" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_audits_status_idx" ON "report_audits" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_audits_reviewed_by_id_idx" ON "report_audits" USING btree ("reviewed_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_audits_created_by_id_idx" ON "report_audits" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_images_report_id_idx" ON "report_images" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_images_order_idx" ON "report_images" USING btree ("order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "report_images_storage_path_idx" ON "report_images" USING btree ("image_url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_location_idx" ON "reports" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_category_id_idx" ON "reports" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_is_verified_idx" ON "reports" USING btree ("is_verified");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "deleted_at";