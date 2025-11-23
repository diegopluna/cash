<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		className,
		border = true
	}: { children: Snippet; className?: string; border?: boolean } = $props();
</script>

<div
	data-slot="data-grid"
	class={cn('grid w-full', border && 'rounded-lg border border-border', className)}
>
	{@render children?.()}
</div>
