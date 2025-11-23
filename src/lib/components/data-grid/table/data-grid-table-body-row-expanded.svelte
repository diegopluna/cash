<script lang="ts" generics="TData extends object">
	import type { Row } from '@tanstack/table-core';
	import { getContext } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { cn } from '$lib/utils';

	let { row }: { row: Row<TData> } = $props();

	const { props: dataGridProps, table } = getContext<DataGridContextProps<TData>>('data-grid');
</script>

<tr class={cn(dataGridProps.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b')}>
	<td colSpan={row.getVisibleCells().length}>
		{@render table
			.getAllColumns()
			.find((column) => column.columnDef.meta?.expandedContent)
			?.columnDef.meta?.expandedContent?.(row.original)?.()}
	</td>
</tr>
