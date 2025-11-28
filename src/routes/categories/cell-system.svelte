<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Lock } from 'lucide-svelte';

	let { isSystem }: { isSystem: boolean } = $props();
</script>

{#if isSystem}
	<Badge variant="secondary" class="gap-1 border-amber-700 bg-amber-900/50 text-amber-300">
		<Lock class="h-3 w-3" />
		System
	</Badge>
{:else}
	<span class="text-muted-foreground">—</span>
{/if}
