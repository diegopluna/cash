<script lang="ts">
	import { FolderTree } from 'lucide-svelte';

	let { parentName }: { parentName: string | null } = $props();
</script>

{#if parentName}
	<div class="flex items-center gap-1.5 text-muted-foreground">
		<FolderTree class="h-3.5 w-3.5" />
		<span class="text-sm">{parentName}</span>
	</div>
{:else}
	<span class="text-muted-foreground">—</span>
{/if}
