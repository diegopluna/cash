<script lang="ts">
	let { name, logoUrl, id }: { name: string; logoUrl: string | null; id: string } = $props();

	let imgError = $state(false);
	const showLogo = $derived(logoUrl && !imgError);
</script>

<a href={`/institutions/${id}`} class="flex items-center gap-2.5 hover:underline">
	{#if showLogo}
		<img
			src={logoUrl}
			alt={name}
			class="h-6 w-6 shrink-0 rounded object-contain"
			onerror={() => (imgError = true)}
		/>
	{:else}
		<div
			class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground"
		>
			{name.charAt(0).toUpperCase()}
		</div>
	{/if}
	<span class="font-medium">{name}</span>
</a>
