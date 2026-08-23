CREATE TYPE "public"."order_status" AS ENUM('NEW', 'CONFIRMED', 'REJECTED', 'DELIVERED');--> statement-breakpoint
CREATE TYPE "public"."pool_status" AS ENUM('ACTIVE', 'CLOSED', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pool_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"locality" text NOT NULL,
	"box_count" integer NOT NULL,
	"status" "order_status" DEFAULT 'NEW' NOT NULL,
	"price_per_kg_snapshot" numeric(10, 2) NOT NULL,
	"estimated_weight_snapshot" numeric(6, 2) NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" integer NOT NULL,
	"status" "pool_status" DEFAULT 'ACTIVE' NOT NULL,
	"capacity_boxes" integer NOT NULL,
	"estimated_box_weight" numeric(5, 2) DEFAULT '13' NOT NULL,
	"price_per_kg" numeric(10, 2) NOT NULL,
	"slaughter_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	CONSTRAINT "pools_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE no action ON UPDATE no action;