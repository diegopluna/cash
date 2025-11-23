<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps } = dataGridContext.get();
</script>

<table
	data-slot="data-grid-table"
	class={cn(
		'w-full caption-bottom text-left align-middle text-sm font-normal text-foreground rtl:text-right',
		!dataGridProps.tableLayout?.columnsDraggable && 'border-separate border-spacing-0',
		dataGridProps.tableLayout?.width === 'fixed' ? 'table-fixed' : 'table-auto',
		dataGridProps.tableClass?.base
	)}
>
	{@render children?.()}
</table>
