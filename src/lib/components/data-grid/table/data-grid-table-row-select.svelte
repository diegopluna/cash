<script lang="ts" generics="TData extends object">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { cn } from '$lib/utils';
	import type { Row } from '@tanstack/table-core';
	import { getCheckBoxSize } from './variants';

	let { row, size }: { row: Row<TData>; size?: 'sm' | 'md' | 'lg' } = $props();
</script>

<div
	class={cn(
		'absolute start-0 top-0 bottom-0 hidden w-[2px] bg-primary',
		row.getIsSelected() && 'block'
	)}
></div>
<Checkbox
	checked={row.getIsSelected()}
	onCheckedChange={(value) => row.toggleSelected(!!value)}
	aria-label="Select row"
	class={cn('align-[inherit]', getCheckBoxSize(size ?? 'sm'))}
/>
