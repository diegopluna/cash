<script lang="ts" generics="TData extends object">
	import type { Column } from '@tanstack/table-core';
	import { getContext, type Snippet } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { bodyCellSpacingVariants } from './variants';
	import { cn } from '$lib/utils';

	let { children, column }: { children: Snippet; column: Column<TData> } = $props();

	const { props: dataGridProps, table } = getContext<DataGridContextProps<TData>>('data-grid');

	const bodyCellSpacing = bodyCellSpacingVariants({
		size: dataGridProps.tableLayout?.dense ? 'dense' : 'default'
	});
</script>

<td
	class={cn(
		'align-middle',
		bodyCellSpacing,
		dataGridProps.tableLayout?.cellBorder && 'border-e',
		dataGridProps.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
		column.columnDef.meta?.cellClass,
		dataGridProps.tableLayout?.columnsPinnable &&
			column.getCanPin() &&
			'data-pinned:backdrop-blur-xs" data-pinned:bg-background/90 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border',
		column.getIndex() === 0 || column.getIndex() === table.getVisibleFlatColumns().length - 1
			? dataGridProps.tableClass?.edgeCell
			: ''
	)}
>
	{@render children?.()}
</td>
