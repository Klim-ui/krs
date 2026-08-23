import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const poolStatus = pgEnum("pool_status", [
  "ACTIVE",
  "CLOSED",
  "COMPLETED",
]);

export const orderStatus = pgEnum("order_status", [
  "NEW",
  "CONFIRMED",
  "REJECTED",
  "DELIVERED",
]);

export const pools = pgTable("pools", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: integer("number").notNull().unique(),
  status: poolStatus("status").notNull().default("ACTIVE"),
  capacityBoxes: integer("capacity_boxes").notNull(),
  estimatedBoxWeight: numeric("estimated_box_weight", {
    precision: 5,
    scale: 2,
  })
    .notNull()
    .default("13"),
  pricePerKg: numeric("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  slaughterDate: timestamp("slaughter_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => pools.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  locality: text("locality").notNull(),
  boxCount: integer("box_count").notNull(),
  status: orderStatus("status").notNull().default("NEW"),
  pricePerKgSnapshot: numeric("price_per_kg_snapshot", {
    precision: 10,
    scale: 2,
  }).notNull(),
  estimatedWeightSnapshot: numeric("estimated_weight_snapshot", {
    precision: 6,
    scale: 2,
  }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Pool = typeof pools.$inferSelect;
export type Order = typeof orders.$inferSelect;
