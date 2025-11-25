import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';
import { categoryTypeEnum } from './enums';
import { relations } from 'drizzle-orm';
import transactions from './transactions';
import transactionSplits from './transaction-splits';

// Hierarchical categories (e.g. Alimentação > Restaurante)
const categories = sqliteTable(
	'categories',
	{
		id: text('id').primaryKey(),

		name: text('name').notNull(),
		type: text('type', { enum: categoryTypeEnum }).notNull().default('expense'),
		parentId: text('parent_id').references((): AnySQLiteColumn => categories.id, {
			onDelete: 'set null'
		}),

		icon: text('icon'),
		color: text('color'),
		isSystem: integer('is_system', { mode: 'boolean' }).notNull().default(false),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [uniqueIndex('categories_name_idx').on(table.name, table.type)]
);

export const categoryRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id]
	}),
	children: many(categories),
	transactions: many(transactions),
	splits: many(transactionSplits)
}));

export default categories;
