<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import { categoriesCollection } from '$lib/tanstack/db/categories-collection';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { columns, type Category } from './columns';
	import { createSvelteTable } from '$lib/components/ui/data-table';
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type ColumnOrderState,
		type SortingState
	} from '@tanstack/table-core';
	import DataGrid from '$lib/components/data-grid/data-grid.svelte';
	import DataGridContainer from '$lib/components/data-grid/data-grid-container.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { DataGridTable } from '$lib/components/data-grid/table';
	import DataGridPagination from '$lib/components/data-grid/data-grid-pagination.svelte';

	const query = useLiveQuery((q) => q.from({ categories: categoriesCollection }));

	let pagination = $state<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});
	let sorting = $state<SortingState>([]);
	let columnOrder = $state<ColumnOrderState>([]);

	const table = createSvelteTable({
		columns,
		get data() {
			return query.data;
		},
		get pageCount() {
			return Math.ceil((query.data.length || 0) / pagination.pageSize);
		},
		getRowId: (row: Category) => row.id.toString(),
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnOrder() {
				return columnOrder;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnOrderChange: (updater) => {
			if (typeof updater === 'function') {
				columnOrder = updater(columnOrder);
			} else {
				columnOrder = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
</script>

<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
			</div>
		</header>
		<DataTable data={query.data} {columns} />
		<DataGrid {table} recordCount={query.data.length || 0} tableLayout={{ cellBorder: true }}>
			<div class="w-full space-y-2.5">
				<DataGridContainer>
					<ScrollArea>
						<DataGridTable />
					</ScrollArea>
				</DataGridContainer>
				<DataGridPagination />
			</div>
		</DataGrid>
	</div>
</div>
