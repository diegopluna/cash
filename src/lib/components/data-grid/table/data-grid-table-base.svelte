<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { cn } from '$lib/utils';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps } = getContext<DataGridContextProps<any>>('data-grid');
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
