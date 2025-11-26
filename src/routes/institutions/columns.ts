import type { ColumnDef } from '@tanstack/table-core';
import type { Institution } from './schema';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import { Checkbox } from '$lib/components/ui/checkbox';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';
import DataTableActions from '$lib/components/data-table/data-table-actions.svelte';
import CellBadge from './cell-badge.svelte';

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
		cell: ({ row }) => {
			return renderComponent(CellBadge, { title: row.original.type, variant: row.original.type });
		},
		accessorKey: 'type'
	},
	{
		id: 'country',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Country',
				column
			}),

		accessorKey: 'country'
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderComponent(DataTableActions, {
				onEdit: () => console.log('edit'),
				onDelete: () => console.log('delete'),
				onDetails: () => console.log('details')
			})
	}
];
