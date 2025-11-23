import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { institutionTypeEnum } from './enums';
import { relations } from 'drizzle-orm';
import accounts from './account';

const institutions = sqliteTable(
	'institutions',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		type: text('type', { enum: institutionTypeEnum }).notNull().default('bank'),
		slug: text('slug'),
		country: text('country').notNull().default('BR'),

		// Brazilian Identifiers
		isbp: text('isbp'), // Brazilian Central Bank ISPB Code
		cnpj: text('cnpj'), // Brazilian Company National Registry (CNPJ)

		websiteUrl: text('website_url'),
		logoUrl: text('logo_url'),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		uniqueIndex('institutions_slug_idx').on(table.slug),
		uniqueIndex('institutions_isbp_idx').on(table.isbp)
	]
);

export const institutionRelations = relations(institutions, ({ many }) => ({
	accounts: many(accounts)
}));

export default institutions;
