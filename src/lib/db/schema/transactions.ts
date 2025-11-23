import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import accounts from './account';
import categories from './category';
import recurrenceRules from './recurrence';
import { paymentMethodEnum, transactionStatusEnum, transactionTypeEnum } from './enums';
import { relations } from 'drizzle-orm';
import transactionSplits from './transaction-splits';
import transactionTags from './transaction-tags';

// Group id to link both sides of a transfer (debit + credit)
const transactions = sqliteTable(
	'transactions',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),

		accountId: integer('account_id')
			.notNull()
			.references(() => accounts.id, { onDelete: 'cascade' }),

		type: text('type', { enum: transactionTypeEnum }).notNull(),
		status: text('status', { enum: transactionStatusEnum }).notNull().default('cleared'),

		// Always positive; semantics come from "type"
		amountCents: integer('amount_cents').notNull(),

		currencyCode: text('currency_code').notNull().default('BRL'),

		description: text('description').notNull(),
		originalDescription: text('original_description'),

		date: integer('date', { mode: 'timestamp_ms' }).notNull(),
		postedAt: integer('posted_at', { mode: 'timestamp_ms' }),

		categoryId: integer('category_id').references(() => categories.id, {
			onDelete: 'set null'
		}),

		paymentMethod: text('payment_method', {
			enum: paymentMethodEnum
		})
			.notNull()
			.default('other'),

		// For transfers: all related rows share the same transferGroupId
		transferGroupId: text('transfer_group_id'),

		// For credit card installments
		installmentNumber: integer('installment_number'),
		installmentCount: integer('installment_count'),

		// Optional link to some external sync / bank connection
		externalId: text('external_id'),
		notes: text('notes'),

		isRecurringInstance: integer('is_recurring_instance', {
			mode: 'boolean'
		})
			.notNull()
			.default(false),
		recurrenceRuleId: integer('recurrence_rule_id').references(() => recurrenceRules.id, {
			onDelete: 'set null'
		}),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('transactions_account_idx').on(table.accountId),
		index('transactions_date_idx').on(table.date),
		index('transactions_transfer_group_idx').on(table.transferGroupId),
		index('transactions_external_idx').on(table.externalId)
	]
);

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id]
	}),
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id]
	}),
	recurrenceRule: one(recurrenceRules, {
		fields: [transactions.recurrenceRuleId],
		references: [recurrenceRules.id]
	}),
	splits: many(transactionSplits),
	tags: many(transactionTags)
}));

export default transactions;
