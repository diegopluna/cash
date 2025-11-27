import db from '$lib/db/database';
import { accounts } from '$lib/db/schema';
import { createTypedCollection } from './create-collection';

export const accountsCollection = createTypedCollection({
	queryKey: ['accounts'],
	table: accounts,
	idColumn: accounts.id,
	queryFn: () => db.query.accounts.findMany()
});
