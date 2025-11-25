import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import transactions from './transactions';
import tags from './tags';
import { relations } from 'drizzle-orm';

// Many-to-many: transactions <-> tags
const transactionTags = sqliteTable(
	'transaction_tags',
	{
		transactionId: text('transaction_id')
			.notNull()
			.references(() => transactions.id, { onDelete: 'cascade' }),
		tagId: text('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({
			name: 'transaction_tags_pk',
			columns: [table.transactionId, table.tagId]
		})
	]
);

export const transactionTagsRelations = relations(transactionTags, ({ one }) => ({
	transaction: one(transactions, {
		fields: [transactionTags.transactionId],
		references: [transactions.id]
	}),
	tag: one(tags, {
		fields: [transactionTags.tagId],
		references: [tags.id]
	})
}));

export default transactionTags;
