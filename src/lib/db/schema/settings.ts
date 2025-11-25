import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const appSettings = sqliteTable('app_settings', {
	id: text('id').primaryKey(),
	currencyCode: text('currency_code').notNull().default('BRL'),
	locale: text('locale').notNull().default('pt-BR'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export default appSettings;
