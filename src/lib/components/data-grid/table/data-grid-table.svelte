<script lang="ts" generics="TData extends object">
	import { getContext } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import DataGridTableBase from './data-grid-table-base.svelte';
	import DataGridTableHead from './data-grid-table-head.svelte';
	import DataGridTableHeadRowCell from './data-grid-table-head-row-cell.svelte';
	import DataGridTableHeadRow from './data-grid-table-head-row.svelte';
	import { FlexRender } from '$lib/components/ui/data-table';
	import DataGridTableHeadRowCellResize from './data-grid-table-head-row-cell-resize.svelte';
	import DataGridTableRowSpacer from './data-grid-table-row-spacer.svelte';
	import DataGridTableBody from './data-grid-table-body.svelte';
	import DataGridTableBodyRowSkeleton from './data-grid-table-body-row-skeleton.svelte';
	import DataGridTableBodyRowSkeletonCell from './data-grid-table-body-row-skeleton-cell.svelte';
	import DataGridTableBodyRow from './data-grid-table-body-row.svelte';
	import DataGridTableBodyRowCell from './data-grid-table-body-row-cell.svelte';
	import DataGridTableBodyRowExpanded from './data-grid-table-body-row-expanded.svelte';
	import DataGridTableEmpty from './data-grid-table-empty.svelte';

	const { table, isLoading, props } = getContext<DataGridContextProps<TData>>('data-grid');
	const pagination = $derived(table.getState().pagination);
</script>

<DataGridTableBase>
	<DataGridTableHead>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<DataGridTableHeadRow {headerGroup}>
				{#each headerGroup.headers as header (header.id)}
					<DataGridTableHeadRowCell {header}>
						{#if !header.isPlaceholder}
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						{/if}
						{#if props.tableLayout?.columnsResizable && header.column.getCanResize()}
							<DataGridTableHeadRowCellResize {header} />
						{/if}
					</DataGridTableHeadRowCell>
				{/each}
			</DataGridTableHeadRow>
		{/each}
	</DataGridTableHead>
	{#if props.tableLayout?.stripped || !props.tableLayout?.rowBorder}
		<DataGridTableRowSpacer />
	{/if}
	<DataGridTableBody>
		{#if isLoading && props.loadingMode === 'skeleton' && pagination.pageSize}
			{#each Array.from({ length: pagination.pageSize }) as _, index}
				<DataGridTableBodyRowSkeleton>
					{#each table.getVisibleFlatColumns() as column}
						<DataGridTableBodyRowSkeletonCell {column}>
							{@render column.columnDef.meta?.skeleton?.()}
						</DataGridTableBodyRowSkeletonCell>
					{/each}
				</DataGridTableBodyRowSkeleton>
			{/each}
		{:else if isLoading && props.loadingMode === 'spinner'}
			<tr>
				<td colspan={table.getVisibleFlatColumns().length} class="p-8">
					<div class="flex items-center justify-center">
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{#if props.loadingMessage}
							{#if typeof props.loadingMessage === 'string'}
								{props.loadingMessage}
							{:else}
								{@render props.loadingMessage?.()}
							{/if}
						{:else}
							'Loading...'
						{/if}
					</div>
				</td>
			</tr>
		{:else if table.getRowModel().rows.length}
			{#each table.getRowModel().rows as row (row.id)}
				<DataGridTableBodyRow {row}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<DataGridTableBodyRowCell {cell}>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</DataGridTableBodyRowCell>
					{/each}
				</DataGridTableBodyRow>
				{#if row.getIsExpanded()}
					<DataGridTableBodyRowExpanded {row} />
				{/if}
			{/each}
		{:else}
			<DataGridTableEmpty />
		{/if}
	</DataGridTableBody>
</DataGridTableBase>
