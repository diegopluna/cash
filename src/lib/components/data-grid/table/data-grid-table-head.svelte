<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { cn } from '$lib/utils';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps } = getContext<DataGridContextProps<any>>('data-grid');
</script>

<thead
	class={cn(
		dataGridProps.tableClass?.header,
		dataGridProps.tableLayout?.headerSticky && dataGridProps.tableClass?.headerSticky
	)}
>
	{@render children?.()}
</thead>
