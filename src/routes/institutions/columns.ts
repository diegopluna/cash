import type { ColumnDef } from '@tanstack/table-core';
import type { Institution } from './schema';
import { renderComponent } from '$lib/components/ui/data-table';
import { Checkbox } from '$lib/components/ui/checkbox';
import DataTableColumnHeader from '$lib/components/data-table/data-table-column-header.svelte';
import DataTableActions from '$lib/components/data-table/data-table-actions.svelte';
import CellBadge from './cell-badge.svelte';
import CellCountry from './cell-country.svelte';
import CellAccountCount from './cell-account-count.svelte';
import CellName from './cell-name.svelte';

// Extended type with account count from join
export type InstitutionWithCount = Institution & {
	accountCount: number;
};

export const columns: ColumnDef<InstitutionWithCount>[] = [
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
				logoUrl: row.original.logoUrl
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
			return renderComponent(CellBadge, { title: row.original.type, variant: row.original.type });
		},
		accessorKey: 'type',
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'country',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Country',
				column
			}),
		cell: ({ row }) => {
			return renderComponent(CellCountry, { code: row.original.country });
		},
		accessorKey: 'country',
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'accountCount',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Accounts',
				column
			}),
		cell: ({ row }) => {
			return renderComponent(CellAccountCount, { count: row.original.accountCount });
		},
		accessorKey: 'accountCount'
	},
	{
		id: 'slug',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'Slug',
				column
			}),
		accessorKey: 'slug',
		cell: ({ row }) => {
			const slug = row.original.slug;
			return slug ? slug : '—';
		}
	},
	{
		id: 'isbp',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'ISPB',
				column
			}),
		accessorKey: 'isbp',
		cell: ({ row }) => {
			const isbp = row.original.isbp;
			return isbp ? isbp : '—';
		}
	},
	{
		id: 'cnpj',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				title: 'CNPJ',
				column
			}),
		accessorKey: 'cnpj',
		cell: ({ row }) => {
			const cnpj = row.original.cnpj;
			return cnpj ? cnpj : '—';
		}
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderComponent(DataTableActions, {
				onEdit: () => console.log('edit', row.original),
				onDelete: () => console.log('delete', row.original),
				onDetails: () => console.log('details', row.original)
			}),
		enableHiding: false
	}
];

export const defaultHiddenColumns = {
	slug: false,
	isbp: false,
	cnpj: false
};
