import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table/data-table-actions.svelte';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';
import { Checkbox } from '$lib/components/ui/checkbox';
import type { Category } from './schema';
import CellType from './cell-type.svelte';
import CellName from './cell-name.svelte';
import CellSystem from './cell-system.svelte';
import CellParent from './cell-parent.svelte';

// Extended type with parent name from join
export type CategoryWithParent = Category & {
	parentName: string | null;
	parentId: string | null;
};

export type ColumnCallbacks = {
	onEdit: (category: CategoryWithParent) => void;
	onDelete: (category: CategoryWithParent) => void;
};

export function createColumns(callbacks: ColumnCallbacks): ColumnDef<CategoryWithParent>[] {
	return [
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
			cell: ({ row }) => {
				return renderComponent(CellName, {
					name: row.original.name,
					icon: row.original.icon,
					color: row.original.color,
					id: row.original.id
				});
			},
			accessorKey: 'name',
			enableHiding: false
		},
		{
			id: 'type',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Type',
					column
				}),
			cell: ({ row }) => {
				return renderComponent(CellType, { type: row.original.type });
			},
			accessorKey: 'type',
			filterFn: (row, id, value: string[]) => {
				return value.includes(row.getValue(id));
			}
		},
		{
			id: 'parent',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'Parent Category',
					column
				}),
			cell: ({ row }) => {
				return renderComponent(CellParent, { parentName: row.original.parentName, parentId: row.original.parentId });
			},
			accessorKey: 'parentName'
		},
		{
			id: 'isSystem',
			header: ({ column }) =>
				renderComponent(DataTableColumnHeader, {
					title: 'System',
					column
				}),
			cell: ({ row }) => {
				return renderComponent(CellSystem, { isSystem: row.original.isSystem });
			},
			accessorKey: 'isSystem',
			filterFn: (row, id, value: string[]) => {
				const isSystem = row.getValue(id);
				return value.includes(isSystem ? 'true' : 'false');
			}
		},
		{
			id: 'actions',
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					onEdit: () => callbacks.onEdit(row.original),
					onDelete: () => callbacks.onDelete(row.original),
					onDetails: () => {} // Categories don't have a details page
				}),
			enableHiding: false
		}
	];
}

export const defaultHiddenColumns = {
	isSystem: false
};
