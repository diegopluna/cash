import db from '$lib/db/database';
import { institutions } from '$lib/db/schema';
import { createTypedCollection } from './create-collection';

export const institutionsCollection = createTypedCollection({
	queryKey: ['institutions'],
	table: institutions,
	idColumn: institutions.id,
	queryFn: () => db.query.institutions.findMany()
});
