<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { DataGridContextProps } from '../types';

	let { children }: { children: Snippet } = $props();

	const { props: dataGridProps } = getContext<DataGridContextProps<any>>('data-grid');
</script>

<tbody
	class={cn(
		'[&_tr:last-child]:border-0',
		dataGridProps.tableLayout?.rowRounded &&
			'[&_td:first-child]:rounded-s-lg [&_td:last-child]:rounded-e-lg',
		dataGridProps.tableClass?.body
	)}
>
	{@render children?.()}
</tbody>
