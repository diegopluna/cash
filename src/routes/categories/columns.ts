import type { categories } from '$lib/db/schema';
import type { ColumnDef } from '@tanstack/table-core';

export type Category = typeof categories.$inferSelect;

export const columns: ColumnDef<Category>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		enableSorting: true,
		enableHiding: true
	},
	{
		header: 'Type',
		accessorKey: 'type',
		meta: {
			headerClass: ''
		}
	},
	{
		header: 'Parent',
		accessorKey: 'parentId'
	},
	{
		header: 'Icon',
		accessorKey: 'icon'
	},
	{
		header: 'Color',
		accessorKey: 'color'
	}
];
