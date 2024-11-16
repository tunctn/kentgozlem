ALTER TABLE "reports" ADD COLUMN "street" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "postal_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "country" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN IF EXISTS "address";