import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import transactions from './transactions';
import categories from './category';
import { relations } from 'drizzle-orm';

// Optional splits per transaction (for advanced categorization)
const transactionSplits = sqliteTable(
	'transaction_splits',
	{
		id: text('id').primaryKey(),
		transactionId: text('transaction_id')
			.notNull()
			.references(() => transactions.id, { onDelete: 'cascade' }),
		categoryId: text('category_id').references(() => categories.id, {
			onDelete: 'set null'
		}),
		amountCents: integer('amount_cents').notNull(),
		notes: text('notes')
	},
	(table) => [index('transaction_splits_tx_idx').on(table.transactionId)]
);

export const transactionSplitsRelations = relations(transactionSplits, ({ one }) => ({
	transaction: one(transactions, {
		fields: [transactionSplits.transactionId],
		references: [transactions.id]
	}),
	category: one(categories, {
		fields: [transactionSplits.categoryId],
		references: [categories.id]
	})
}));

export default transactionSplits;
