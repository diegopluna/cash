<script lang="ts" generics="TData extends object">
	import type { Cell } from '@tanstack/table-core';
	import { type Snippet } from 'svelte';
	import { bodyCellSpacingVariants, getPinningStyles } from './variants';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let {
		children,
		cell,
		dndRef = $bindable(),
		dndStyle
	}: {
		children: Snippet;
		cell: Cell<TData, unknown>;
		dndRef?: HTMLTableCellElement;
		dndStyle?: string;
	} = $props();

	const { props: dataGridProps } = dataGridContext.get();
	const { column, row } = cell;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left');
	const isFirstRightPinned = isPinned === 'right' && column.getIsFirstColumn('right');
	const bodyCellSpacing = bodyCellSpacingVariants({
		size: dataGridProps.tableLayout?.dense ? 'dense' : 'default'
	});
	const cellStyle = [
		dataGridProps.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column),
		dndStyle
	]
		.filter(Boolean)
		.join(' ');
</script>

<td
	bind:this={dndRef}
	{...dataGridProps.tableLayout?.columnsDraggable && !isPinned ? { cell } : {}}
	style={cellStyle}
	data-pinned={isPinned || undefined}
	data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
	class={cn(
		'align-middle',
		bodyCellSpacing,
		dataGridProps.tableLayout?.cellBorder && 'border-e',
		dataGridProps.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
		cell.column.columnDef.meta?.cellClass,
		dataGridProps.tableLayout?.columnsPinnable &&
			column.getCanPin() &&
			'data-pinned:backdrop-blur-xs" data-pinned:bg-background/90 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border',
		column.getIndex() === 0 || column.getIndex() === row.getVisibleCells().length - 1
			? dataGridProps.tableClass?.edgeCell
			: ''
	)}
>
	{@render children?.()}
</td>
