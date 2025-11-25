<script lang="ts">
	import { Settings2 } from 'lucide-svelte';
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { dataTableContext } from './context';
	import { buttonVariants } from '../ui/button';

	const table = dataTableContext.get();
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={buttonVariants({
			variant: 'outline',
			size: 'sm',
			class: 'ms-auto hidden h-8 lg:flex'
		})}
	>
		<Settings2 />
		View
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<DropdownMenuGroup>
			<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
			<DropdownMenuSeparator />
			{#each table
				.getAllColumns()
				.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column)}
				<DropdownMenuCheckboxItem
					bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
					class="capitalize"
				>
					{column.id}
				</DropdownMenuCheckboxItem>
			{/each}
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
