<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Column } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { Button } from '../ui/button';
	import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon } from 'lucide-svelte';

	let {
		column,
		title,
		class: className,
		...restProps
	}: { column: Column<any>; title: string } & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if !column.getCanSort()}
	<div class={className} {...restProps}>
		{title}
	</div>
{:else}
	<div class={cn('flex items-center', className)} {...restProps}>
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="sm"
						class="-ms-3 h-8 data-[state=open]:bg-accent"
					>
						<span>
							{title}
						</span>
						{#if column.getIsSorted() === 'desc'}
							<ArrowDownIcon />
						{:else if column.getIsSorted() === 'asc'}
							<ArrowUpIcon />
						{:else}
							<ChevronsUpDownIcon />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onclick={() => column.toggleSorting(false)}>
					<ArrowUpIcon class="me-2 size-3.5 text-muted-foreground/70" />
					Asc
				</DropdownMenuItem>
				<DropdownMenuItem onclick={() => column.toggleSorting(true)}>
					<ArrowDownIcon class="me-2 size-3.5 text-muted-foreground/70" />
					Desc
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onclick={() => column.toggleVisibility(false)}>
					<EyeOffIcon class="me-2 size-3.5 text-muted-foreground/70" />
					Hide
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
{/if}
