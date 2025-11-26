import type { ColumnDef } from '@tanstack/table-core';
import type { Institution } from './schema';
import { renderComponent } from '$lib/components/ui/data-table';
import { Checkbox } from '$lib/components/ui/checkbox';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';

export const columns: ColumnDef<Institution>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(value),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Name',
				column
			}),
		accessorKey: 'name'
	},
	{
		id: 'type',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Type',
				column
			}),
		accessorKey: 'type'
	}
];
