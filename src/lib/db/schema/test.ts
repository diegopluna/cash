import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const testTable = sqliteTable('test', {
	id: integer('id').primaryKey(),
	name: text('name')
});

export default testTable;
