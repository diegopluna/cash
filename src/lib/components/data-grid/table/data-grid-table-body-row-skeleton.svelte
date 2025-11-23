<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { cn } from '$lib/utils';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps, table } = getContext<DataGridContextProps<any>>('data-grid');
</script>

<tr
	class={cn(
		'hover:bg-muted/40 data-[state=selected]:bg-muted/50',
		dataGridProps.onRowClick && 'cursor-pointer',
		!dataGridProps.tableLayout?.stripped &&
			dataGridProps.tableLayout?.rowBorder &&
			'border-b border-border [&:not(:last-child)>td]:border-b',
		dataGridProps.tableLayout?.cellBorder && '*:last:border-e-0',
		dataGridProps.tableLayout?.stripped &&
			'odd:bg-muted/90 hover:bg-transparent odd:hover:bg-muted',
		table.options.enableRowSelection && '*:first:relative',
		dataGridProps.tableClass?.bodyRow
	)}
>
	{@render children?.()}
</tr>
