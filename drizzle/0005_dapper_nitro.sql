CREATE TYPE "public"."report_status_enum" AS ENUM('pending', 'investigating', 'rejected', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."report_audit_status_enum" AS ENUM('pending', 'investigating', 'rejected', 'resolved');--> statement-breakpoint
ALTER TYPE "public"."user_role" RENAME TO "user_role_enum";--> statement-breakpoint
ALTER TABLE "report_audits" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "report_audits" ALTER COLUMN "status" SET DATA TYPE report_audit_status_enum USING status::text::report_audit_status_enum;
ALTER TABLE "report_audits" ALTER COLUMN "status" SET DEFAULT 'pending';

ALTER TABLE "reports" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reports" ALTER COLUMN "status" SET DATA TYPE report_status_enum USING status::text::report_status_enum;
ALTER TABLE "reports" ALTER COLUMN "status" SET DEFAULT 'pending';
DROP TYPE "public"."report_status";
