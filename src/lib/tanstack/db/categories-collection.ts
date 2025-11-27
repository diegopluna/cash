import db from '$lib/db/database';
import { categories } from '$lib/db/schema';
import { createTypedCollection } from './create-collection';

export const categoriesCollection = createTypedCollection({
	queryKey: ['categories'],
	table: categories,
	idColumn: categories.id,
	queryFn: () => db.query.categories.findMany()
});
