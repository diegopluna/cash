import { institutions } from '$lib/db/schema';
import { createInsertSchema } from 'drizzle-zod';

export const institutionsInsertSchema = createInsertSchema(institutions);

export type Institution = typeof institutions.$inferSelect;
