import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/svelte-db';
import { queryClient } from '../query';
import db from '$lib/db/database';
import { eq } from 'drizzle-orm';
import type { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';

// TODO: Add pagination/virtualization support to avoid loading all records at once
export function createTypedCollection<TItem extends { id: string }>({
	queryKey,
	table,
	idColumn,
	queryFn
}: {
	queryKey: string[];
	table: SQLiteTable;
	idColumn: SQLiteColumn;
	queryFn: () => Promise<TItem[]>;
}) {
	return createCollection(
		queryCollectionOptions({
			queryClient,
			queryKey,
			queryFn,
			getKey: (item: TItem) => item.id,
			onUpdate: async ({ transaction }) => {
				const updates = transaction.mutations.map((m) => m.modified);
				await db.transaction(async (tx) => {
					for (const item of updates) {
						await tx
							.update(table)
							.set(item as Record<string, unknown>)
							.where(eq(idColumn, item.id));
					}
				});
			},
			onInsert: async ({ transaction }) => {
				const newItems = transaction.mutations.map((m) => m.modified);
				await db.transaction(async (tx) => {
					for (const item of newItems) {
						await tx.insert(table).values(item as Record<string, unknown>);
					}
				});
			},
			onDelete: async ({ transaction }) => {
				const deletedItems = transaction.mutations.map((m) => m.original);
				await db.transaction(async (tx) => {
					for (const item of deletedItems) {
						await tx.delete(table).where(eq(idColumn, item.id));
					}
				});
			}
		})
	);
}
