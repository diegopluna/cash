<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { count }: { count: number } = $props();
</script>

{#if count > 0}
	<Badge variant="secondary" class="font-mono">
		{count}
	</Badge>
{:else}
	<span class="text-muted-foreground">—</span>
{/if}
