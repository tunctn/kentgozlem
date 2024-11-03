CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
