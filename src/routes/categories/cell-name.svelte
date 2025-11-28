<script lang="ts">
	let {
		name,
		icon,
		color,
		id
	}: {
		name: string;
		icon: string | null;
		color: string | null;
		id: string;
	} = $props();

	// Default icon if none provided
	const displayIcon = $derived(icon ?? '📁');
</script>

<a class="flex items-center gap-2.5 hover:underline" href={`/categories/${id}`}>
	{#if color}
		<div
			class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm"
			style="background-color: {color}20; border: 1px solid {color}40;"
		>
			{displayIcon}
		</div>
	{:else}
		<div
			class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-sm text-muted-foreground"
		>
			{displayIcon}
		</div>
	{/if}
	<span class="font-medium">{name}</span>
</a>
