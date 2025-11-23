<script lang="ts">
	import { getContext } from 'svelte';
	import type { DataGridContextProps } from '../types';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { cn } from '$lib/utils';
	import { getCheckBoxSize } from './variants';

	let { size }: { size?: 'sm' | 'md' | 'lg' } = $props();

	const { table, recordCount, isLoading } = getContext<DataGridContextProps<any>>('data-grid');
</script>

<Checkbox
	checked={table.getIsAllPageRowsSelected()}
	indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
	disabled={isLoading || recordCount === 0}
	onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	aria-label="Select all"
	class={cn('align-[inherit]', getCheckBoxSize(size ?? 'sm'))}
/>
