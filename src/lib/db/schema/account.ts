import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import institutions from './institutions';
import { accountTypeEnum } from './enums';
import { relations } from 'drizzle-orm';
import transactions from './transactions';

const accounts = sqliteTable(
	'accounts',
	{
		id: text('id').primaryKey(),
		institutionId: text('institution_id').references(() => institutions.id, {
			onDelete: 'set null'
		}),
		name: text('name').notNull(),
		type: text('type', { enum: accountTypeEnum }).notNull().default('checking'),
		currencyCode: text('currency_code').notNull().default('BRL'),

		// Brazilian bank details (Optional)
		bankCode: text('bank_code'),
		branchNumber: text('branch_number'),
		accountNumber: text('account_number'),
		accountDigit: text('account_digit'),

		// Credit card-specific (optional)
		cardLast4: text('card_last_4'),
		cardClosingDay: integer('card_closing_day'),
		cardDueDay: integer('card_due_day'),
		creditLimitCents: integer('credit_limit_cents'),

		// Money in cents (e.g. R$ 10,00 -> 1000)
		initialBalanceCents: integer('initial_balance_cents').notNull().default(0),
		currentBalanceCents: integer('current_balance_cents').notNull().default(0),

		includeInNetWorth: integer('include_in_net_worth', { mode: 'boolean' }).notNull().default(true),
		includeInCashFlow: integer('include_in_cash_flow', { mode: 'boolean' }).notNull().default(true),

		isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
		closedAt: integer('closed_at', { mode: 'timestamp_ms' }),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [index('accounts_institution_id_idx').on(table.institutionId)]
);

export const accountRelations = relations(accounts, ({ one, many }) => ({
	institution: one(institutions, {
		fields: [accounts.institutionId],
		references: [institutions.id]
	}),
	transactions: many(transactions)
}));

export default accounts;
