<script lang="ts" generics="TData extends object">
	import { type Snippet } from 'svelte';
	import type { Header } from '@tanstack/table-core';
	import { getPinningStyles, headerCellSpacingVariants } from './variants';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let {
		children,
		header,
		dndRef = $bindable(),
		dndStyle
	}: {
		children: Snippet;
		header: Header<TData, unknown>;
		dndRef?: HTMLTableCellElement;
		dndStyle?: string;
	} = $props();

	const { props: dataGridProps } = dataGridContext.get();
	const { column } = header;
	const isPinned = $derived(column.getIsPinned());
	const isLastLeftPinned = $derived(isPinned === 'left' && column.getIsLastColumn('left'));
	const isFirstRightPinned = $derived(isPinned === 'right' && column.getIsFirstColumn('right'));
	const headerCellSpacing = $derived(
		headerCellSpacingVariants({
			size: dataGridProps.tableLayout?.dense ? 'dense' : 'default'
		})
	);

	const cellStyle = $derived(
		[
			dataGridProps.tableLayout?.width === 'fixed' && `width: ${header.getSize()}px;`,
			dataGridProps.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column),
			dndStyle
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<th
	bind:this={dndRef}
	style={cellStyle}
	data-pinned={isPinned || undefined}
	data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
	class={cn(
		'relative h-10 text-left align-middle font-normal text-foreground rtl:text-right [&:has([role=checkbox])]:pe-0',
		headerCellSpacing,
		dataGridProps.tableLayout?.cellBorder && 'border-e',
		dataGridProps.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
		dataGridProps.tableLayout?.columnsPinnable &&
			column.getCanPin() &&
			'data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border',
		header.column.columnDef.meta?.headerClass,
		column.getIndex() === 0 || column.getIndex() === header.headerGroup.headers.length - 1
			? dataGridProps.tableClass?.edgeCell
			: ''
	)}
>
	{@render children?.()}
</th>
