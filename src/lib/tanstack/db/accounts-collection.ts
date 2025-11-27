import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/svelte-db';
import { queryClient } from '../query';
import db from '$lib/db/database';
import { accounts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// TODO: Create a base createCollection function to reduce duplication across collections
// Also, add pagination/virtualization support to avoid loading all records at once
export const accountsCollection = createCollection(
	queryCollectionOptions({
		queryClient,
		queryKey: ['accounts'],
		queryFn: async () => await db.query.accounts.findMany(),
		getKey: (item) => item.id,
		onUpdate: async ({ transaction }) => {
			const updates = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of updates) {
					await tx.update(accounts).set(item).where(eq(accounts.id, item.id));
				}
			});
		},
		onInsert: async ({ transaction }) => {
			const newItems = transaction.mutations.map((m) => m.modified);
			await db.transaction(async (tx) => {
				for (const item of newItems) {
					await tx.insert(accounts).values(item);
				}
			});
		},
		onDelete: async ({ transaction }) => {
			const deletedItems = transaction.mutations.map((m) => m.original);
			await db.transaction(async (tx) => {
				for (const item of deletedItems) {
					await tx.delete(accounts).where(eq(accounts.id, item.id));
				}
			});
		}
	})
);
