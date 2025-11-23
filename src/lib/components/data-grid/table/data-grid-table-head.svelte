<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { dataGridContext } from '../context';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps } = dataGridContext.get();
</script>

<thead
	class={cn(
		dataGridProps.tableClass?.header,
		dataGridProps.tableLayout?.headerSticky && dataGridProps.tableClass?.headerSticky
	)}
>
	{@render children?.()}
</thead>
