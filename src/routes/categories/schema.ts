import { createInsertSchema } from 'drizzle-zod';
import { categories } from '$lib/db/schema';

export const categoriesInsertSchema = createInsertSchema(categories);
export type Category = typeof categories.$inferSelect;
