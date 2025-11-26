<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		label,
		class: className,
		...rest
	}: { label: string } & Partial<HTMLAnchorAttributes> = $props();
</script>

<a
	{...rest}
	class={cn('font-medium text-foreground underline underline-offset-4', className)}
	target="_blank"
	rel="noopener noreferrer"
>
	{label}
</a>
