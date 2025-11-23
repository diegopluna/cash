<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps, table } = dataGridContext.get();
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
