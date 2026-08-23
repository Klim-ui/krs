ALTER TABLE "pools" ALTER COLUMN "estimated_box_weight" SET DEFAULT '50';--> statement-breakpoint
UPDATE "pools"
SET "capacity_boxes" = 4,
    "estimated_box_weight" = 50,
    "price_per_kg" = 550
WHERE "status" = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1 FROM "orders" WHERE "orders"."pool_id" = "pools"."id"
  );