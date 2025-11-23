import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { frequencyEnum } from './enums';
import { relations } from 'drizzle-orm';
import transactions from './transactions';

// Recurrence rules (e.g. aluguel mensal)
const recurrenceRules = sqliteTable(
	'recurrence_rules',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),

		frequency: text('frequency', { enum: frequencyEnum }).notNull().default('monthly'),
		interval: integer('interval').notNull().default(1), // every N periods

		startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
		endDate: integer('end_date', { mode: 'timestamp_ms' }),
		nextRunAt: integer('next_run_at', { mode: 'timestamp_ms' }),

		isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
		description: text('description'),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [index('recurrence_rules_next_run_at_idx').on(table.nextRunAt)]
);

export const recurrenceRulesRelations = relations(recurrenceRules, ({ many }) => ({
	instances: many(transactions)
}));

export default recurrenceRules;
