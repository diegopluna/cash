<script lang="ts">
	import { FolderTree } from 'lucide-svelte';

	let { parentName, parentId }: { parentName: string | null; parentId: string | null } = $props();
</script>

{#if parentName}
	<a href={`/categories/${parentId}`} class="flex items-center gap-1.5 text-muted-foreground">
		<FolderTree class="h-3.5 w-3.5" />
		<span class="text-sm hover:underline">{parentName}</span>
	</a>
{:else}
	<span class="text-muted-foreground">—</span>
{/if}
