<script lang="ts" generics="TData extends object">
	import type { Row } from '@tanstack/table-core';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let { row }: { row: Row<TData> } = $props();

	const { props: dataGridProps, table } = dataGridContext.get();
</script>

<tr class={cn(dataGridProps.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b')}>
	<td colSpan={row.getVisibleCells().length}>
		{@render table
			.getAllColumns()
			.find((column) => column.columnDef.meta?.expandedContent)
			?.columnDef.meta?.expandedContent?.(row.original)?.()}
	</td>
</tr>
