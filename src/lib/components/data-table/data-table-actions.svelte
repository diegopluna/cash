<script lang="ts">
	import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';

	let { onEdit, onDelete }: { onEdit: () => void; onDelete: () => void } = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
				<EllipsisIcon />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-[160px]" align="end">
		<DropdownMenuItem onclick={onEdit}>
			<PencilIcon />
			Edit
		</DropdownMenuItem>
		<DropdownMenuItem variant="destructive" onclick={onDelete}>
			<TrashIcon />
			Delete
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
