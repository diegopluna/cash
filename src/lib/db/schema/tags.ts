import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import transactionTags from './transaction-tags';

const tags = sqliteTable(
	'tags',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),

		name: text('name').notNull(),
		color: text('color'),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [uniqueIndex('tags_name_idx').on(table.name)]
);

export const tagsRelations = relations(tags, ({ many }) => ({
	transactionTags: many(transactionTags)
}));

export default tags;
