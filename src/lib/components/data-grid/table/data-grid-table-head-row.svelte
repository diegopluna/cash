<script lang="ts" generics="TData extends object">
	import type { HeaderGroup } from '@tanstack/table-core';
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let { children, headerGroup }: { children: Snippet; headerGroup: HeaderGroup<TData> } = $props();

	const { props: dataGridProps } = dataGridContext.get();
</script>

<tr
	class={cn(
		'bg-muted/40',
		dataGridProps.tableLayout?.headerBorder && '[&>th]:border-b',
		dataGridProps.tableLayout?.cellBorder && '*:last:border-e-0',
		dataGridProps.tableLayout?.stripped && 'bg-transparent',
		dataGridProps.tableLayout?.headerBackground === false && 'bg-transparent',
		dataGridProps.tableClass?.headerRow
	)}
>
	{@render children?.()}
</tr>
