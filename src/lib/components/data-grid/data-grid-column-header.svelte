<script lang="ts" generics="TData extends object, TValue">
	import type { Column } from '@tanstack/table-core';
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { Button } from '../ui/button';
	import {
		ArrowDown,
		ArrowDownIcon,
		ArrowLeft,
		ArrowLeftToLine,
		ArrowRight,
		ArrowRightToLine,
		ArrowUp,
		ArrowUpIcon,
		Check,
		ChevronsUpDownIcon,
		PinOff,
		Settings2
	} from 'lucide-svelte';
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuSub,
		DropdownMenuSubTrigger,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import DropdownMenuSubContent from '../ui/dropdown-menu/dropdown-menu-sub-content.svelte';
	import { dataGridContext } from './context';

	interface DataGridColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
		column: Column<TData, TValue>;
		title?: string;
		icon?: Snippet;
		pinnable?: boolean;
		filter?: Snippet;
		visibility?: boolean;
	}

	let {
		column,
		title = '',
		icon,
		class: className,
		filter,
		visibility = false
	}: DataGridColumnHeaderProps<TData, TValue> = $props();

	const { isLoading, table, props: dataGridProps, recordCount } = dataGridContext.get();

	const moveColumn = (direction: 'left' | 'right') => {
		const currentOrder = [...table.getState().columnOrder]; // Get current column order
		const currentIndex = currentOrder.indexOf(column.id); // Get current index of the column
		if (direction === 'left' && currentIndex > 0) {
			// Move column left
			const newOrder = [...currentOrder];
			const [movedColumn] = newOrder.splice(currentIndex, 1);
			newOrder.splice(currentIndex - 1, 0, movedColumn);
			table.setColumnOrder(newOrder); // Update column order
		}
		if (direction === 'right' && currentIndex < currentOrder.length - 1) {
			// Move column right
			const newOrder = [...currentOrder];
			const [movedColumn] = newOrder.splice(currentIndex, 1);
			newOrder.splice(currentIndex + 1, 0, movedColumn);
			table.setColumnOrder(newOrder); // Update column order
		}
	};

	const canMove = (direction: 'left' | 'right'): boolean => {
		const currentOrder = table.getState().columnOrder;
		const currentIndex = currentOrder.indexOf(column.id);
		if (direction === 'left') {
			return currentIndex > 0;
		} else {
			return currentIndex < currentOrder.length - 1;
		}
	};
</script>

{#snippet headerLabel()}
	<div
		class={cn(
			'inline-flex h-full items-center gap-1.5 text-[0.8125rem] leading-[calc(1.125/0.8125)] font-normal text-secondary-foreground/80 [&_svg]:size-3.5 [&_svg]:opacity-60',
			className
		)}
	>
		{#if icon}
			{@render icon?.()}
		{/if}
		{title}
	</div>
{/snippet}

{#snippet headerButton()}
	<Button
		variant="ghost"
		class={cn(
			'-ms-2 h-7 rounded-md px-2 font-normal text-secondary-foreground/80 hover:bg-secondary hover:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground',
			className
		)}
		disabled={isLoading || recordCount === 0}
		onclick={() => {
			const isSorted = column.getIsSorted();
			if (isSorted === 'asc') {
				column.toggleSorting(true);
			} else if (isSorted === 'desc') {
				column.clearSorting();
			} else {
				column.toggleSorting(false);
			}
		}}
	>
		{#if icon}
			{@render icon?.()}
		{/if}
		{title}
		{#if column.getCanSort()}
			{#if column.getIsSorted() === 'desc'}
				<ArrowDownIcon class="mt-px size-[0.7rem]!" />
			{:else if column.getIsSorted() === 'asc'}
				<ArrowUpIcon class="mt-px size-[0.7rem]!" />
			{:else}
				<ChevronsUpDownIcon class="mt-px size-[0.7rem]!" />
			{/if}
		{/if}
	</Button>
{/snippet}

{#snippet headerPin()}
	<Button
		size="sm"
		variant="ghost"
		class="-me-1 size-7 rounded-md"
		onclick={() => column.pin(false)}
		aria-label={`Unpin ${title} column`}
		title={`Unpin ${title} column`}
	>
		<PinOff class="size-3.5! opacity-50!" aria-hidden="true" />
	</Button>
{/snippet}

{#snippet headerControls()}
	<div class="flex h-full items-center justify-between gap-1.5">
		<DropdownMenu>
			<DropdownMenuTrigger>{@render headerButton?.()}</DropdownMenuTrigger>
			<DropdownMenuContent class="w-40" align="start">
				{#if filter}
					<DropdownMenuLabel>{@render filter?.()}</DropdownMenuLabel>
				{/if}
				{#if filter && (column.getCanSort() || column.getCanPin() || visibility)}
					<DropdownMenuSeparator />
				{/if}
				{#if column.getCanSort()}
					<DropdownMenuItem
						onclick={() => {
							if (column.getIsSorted() === 'asc') {
								column.clearSorting();
							} else {
								column.toggleSorting(false);
							}
						}}
						disabled={!column.getCanSort()}
					>
						<ArrowUp class="size-3.5!" />
						<span class="grow">Asc</span>
						{#if column.getIsSorted() === 'asc'}
							<Check class="size-4 text-primary opacity-100!" />
						{/if}
					</DropdownMenuItem>
					<DropdownMenuItem
						onclick={() => {
							if (column.getIsSorted() === 'desc') {
								column.clearSorting();
							} else {
								column.toggleSorting(true);
							}
						}}
						disabled={!column.getCanSort()}
					>
						<ArrowDown className="size-3.5!" />
						<span class="grow">Desc</span>
						{#if column.getIsSorted() === 'desc'}
							<Check class="size-4 text-primary opacity-100!" />
						{/if}
					</DropdownMenuItem>
				{/if}

				{#if (filter || column.getCanSort()) && (column.getCanSort() || column.getCanPin() || visibility)}
					<DropdownMenuSeparator />
				{/if}

				{#if dataGridProps.tableLayout?.columnsPinnable && column.getCanPin()}
					<DropdownMenuItem
						onclick={() => column.pin(column.getIsPinned() === 'left' ? false : 'left')}
					>
						<ArrowLeftToLine class="size-3.5!" aria-hidden="true" />
						<span class="grow">Pin to left</span>
						{#if column.getIsPinned() === 'left'}
							<Check class="size-4 text-primary opacity-100!" />
						{/if}
					</DropdownMenuItem>
					<DropdownMenuItem
						onclick={() => column.pin(column.getIsPinned() === 'right' ? false : 'right')}
					>
						<ArrowRightToLine class="size-3.5!" aria-hidden="true" />
						<span class="grow">Pin to right</span>
						{#if column.getIsPinned() === 'right'}
							<Check class="size-4 text-primary opacity-100!" />
						{/if}
					</DropdownMenuItem>
				{/if}

				{#if dataGridProps.tableLayout?.columnsMovable}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onclick={() => moveColumn('left')}
						disabled={!canMove('left') || column.getIsPinned() !== false}
					>
						<ArrowLeft className="size-3.5!" aria-hidden="true" />
						<span>Move to Left</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onclick={() => moveColumn('right')}
						disabled={!canMove('right') || column.getIsPinned() !== false}
					>
						<ArrowRight className="size-3.5!" aria-hidden="true" />
						<span>Move to Right</span>
					</DropdownMenuItem>
				{/if}

				{#if dataGridProps.tableLayout?.columnsVisibility && visibility && (column.getCanSort() || column.getCanPin() || filter)}
					<DropdownMenuSeparator />
				{/if}

				{#if dataGridProps.tableLayout?.columnsVisibility && visibility}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Settings2 class="size-3.5!" />
							<span>Columns</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{#each table
								.getAllColumns()
								.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as col}
								<DropdownMenuCheckboxItem
									checked={col.getIsVisible()}
									onSelect={(e) => e.preventDefault()}
									onCheckedChange={(value) => col.toggleVisibility(!!value)}
									class="capitalize"
								>
									{col.columnDef.meta?.headerTitle || col.id}
								</DropdownMenuCheckboxItem>
							{/each}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				{/if}
			</DropdownMenuContent>
		</DropdownMenu>
		{#if dataGridProps.tableLayout?.columnsPinnable && column.getCanPin() && column.getIsPinned()}
			{@render headerPin?.()}
		{/if}
	</div>
{/snippet}

{#if dataGridProps.tableLayout?.columnsMovable || (dataGridProps.tableLayout?.columnsVisibility && visibility) || (dataGridProps.tableLayout?.columnsPinnable && column.getCanPin()) || filter}
	{@render headerControls?.()}
{:else if column.getCanSort() || (dataGridProps.tableLayout?.columnsResizable && column.getCanResize())}
	<div class="flex h-full items-center">{@render headerButton?.()}</div>
{:else}
	{@render headerLabel?.()}
{/if}
