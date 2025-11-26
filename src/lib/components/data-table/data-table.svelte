<script lang="ts" generics="TData, TValue">
	import {
		getCoreRowModel,
		getPaginationRowModel,
		type PaginationState,
		type ColumnDef,
		type SortingState,
		getSortedRowModel,
		type ColumnFiltersState,
		getFilteredRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		type VisibilityState,
		type RowSelectionState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderComponent } from '../ui/data-table';
	import type { Component, Snippet } from 'svelte';
	import { dataTableContext } from './context';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
	import DataTablePagination from './data-table-pagination.svelte';
	import DataTableColumnHeader from './data-table-column-header.svelte';
	import DataTableToolbar from './data-table-toolbar.svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		filterPlaceholder?: string;
		searchColumnId?: string;
		initialColumnVisibility?: VisibilityState;
		facetedFilters?: {
			columnId: string;
			title: string;
			options: {
				label: string;
				value: string;
				icon?: Component;
			}[];
		}[];
	};

	let {
		data,
		columns,
		filterPlaceholder = 'Search...',
		searchColumnId,
		initialColumnVisibility = {},
		facetedFilters
	}: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let columnVisibility = $state<VisibilityState>(initialColumnVisibility);
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>([]);
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	dataTableContext.set(table);
</script>

<div class="space-y-4">
	<DataTableToolbar {filterPlaceholder} {searchColumnId} {facetedFilters} />
	<div class="rounded-md border">
		<Table>
			<TableHeader>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<TableRow>
						{#each headerGroup.headers as header (header.id)}
							<TableHead colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</TableHead>
						{/each}
					</TableRow>
				{/each}
			</TableHeader>
			<TableBody>
				{#each table.getRowModel().rows as row (row.id)}
					<TableRow data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableCell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</TableCell>
						{/each}
					</TableRow>
				{:else}
					<TableRow>
						<TableCell colspan={columns.length} class="h-24 text-center">No results.</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<DataTablePagination />
</div>
