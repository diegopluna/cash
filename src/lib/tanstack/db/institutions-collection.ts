import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/svelte-db';
import { queryClient } from '../query';
import db from '$lib/db/database';
import { institutions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const institutionsCollection = createCollection(
	queryCollectionOptions({
		queryKey: ['institutions'],
		queryClient,
		queryFn: async () => await db.query.institutions.findMany(),
		getKey: (item) => item.id,
		onUpdate: async ({ transaction }) => {
			const updates = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of updates) {
					await tx.update(institutions).set(item).where(eq(institutions.id, item.id));
				}
			});
		},
		onInsert: async ({ transaction }) => {
			const newItems = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of newItems) {
					await tx.insert(institutions).values(item);
				}
			});
		},
		onDelete: async ({ transaction }) => {
			const deletedItems = transaction.mutations.map((m) => m.original);
			await db.transaction(async (tx) => {
				for (const item of deletedItems) {
					await tx.delete(institutions).where(eq(institutions.id, item.id));
				}
			});
		}
	})
);
