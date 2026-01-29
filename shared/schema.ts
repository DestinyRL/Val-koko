
import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  answer: boolean("answer").notNull(), // true for yes, false for no
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({ 
  id: true, 
  timestamp: true 
});

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;
