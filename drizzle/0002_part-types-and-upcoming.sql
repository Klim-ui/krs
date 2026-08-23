CREATE TYPE "public"."part_type" AS ENUM('FRONT', 'BACK', 'ANY');--> statement-breakpoint
ALTER TYPE "public"."pool_status" ADD VALUE 'UPCOMING' BEFORE 'CLOSED';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "part_type" "part_type" DEFAULT 'ANY' NOT NULL;