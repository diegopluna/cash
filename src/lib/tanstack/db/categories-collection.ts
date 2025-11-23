import db from '$lib/db/database';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/svelte-db';
import { queryClient } from '../query';
import { categories } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const categoriesCollection = createCollection(
	queryCollectionOptions({
		queryKey: ['categories'],
		queryFn: async () => await db.query.categories.findMany(),
		queryClient,
		getKey: (item) => item.id,
		onUpdate: async ({ transaction }) => {
			const updates = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of updates) {
					await tx.update(categories).set(item).where(eq(categories.id, item.id));
				}
			});
		},
		onInsert: async ({ transaction }) => {
			const newItems = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of newItems) {
					await tx.insert(categories).values(item);
				}
			});
		},
		onDelete: async ({ transaction }) => {
			const deletedItems = transaction.mutations.map((m) => m.original);
			await db.transaction(async (tx) => {
				for (const item of deletedItems) {
					await tx.delete(categories).where(eq(categories.id, item.id));
				}
			});
		}
	})
);
