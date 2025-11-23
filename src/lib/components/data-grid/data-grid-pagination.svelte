<script lang="ts">
	import { type Snippet } from 'svelte';
	import { Skeleton } from '../ui/skeleton';
	import { cn } from '$lib/utils';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
	import { Button } from '../ui/button';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { dataGridContext } from './context';

	interface DataGridPaginationProps {
		sizes?: number[];
		sizesInfo?: string;
		sizesLabel?: string;
		sizesDescription?: string;
		sizesSkeleton?: Snippet;
		more?: boolean;
		moreLimit?: number;
		info?: string;
		infoSkeleton?: Snippet;
		className?: string;
		rowsPerPageLabel?: string;
		previousPageLabel?: string;
		nextPageLabel?: string;
		ellipsisText?: string;
	}

	let props: DataGridPaginationProps = $props();

	const { table, recordCount, isLoading } = dataGridContext.get();

	const defaultProps: Partial<DataGridPaginationProps> = {
		sizes: [5, 10, 25, 50, 100],
		sizesLabel: 'Show',
		sizesDescription: 'per page',
		moreLimit: 5,
		more: false,
		info: '{from} - {to} of {count}',
		rowsPerPageLabel: 'Rows per page',
		previousPageLabel: 'Go to previous page',
		nextPageLabel: 'Go to next page',
		ellipsisText: '...'
	};

	const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };
	const btnBaseClass = 'size-7 p-0 text-sm';
	const btnArrowClass = btnBaseClass + 'rtl:transform rtl:rotate-180';
	const pageIndex = $derived(table.getState().pagination.pageIndex);
	const pageSize = $derived(table.getState().pagination.pageSize);
	const from = $derived(pageIndex * pageSize + 1);
	const to = $derived(Math.min(from + pageSize - 1, recordCount));
	const pageCount = $derived(table.getPageCount());

	const paginationInfo = $derived(
		mergedProps.info
			? mergedProps.info
					.replace('{from}', from.toString())
					.replace('{to}', to.toString())
					.replace('{count}', recordCount.toString())
			: `${from} - ${to} of ${recordCount}`
	);

	const paginationMoreLimit = $derived(mergedProps.moreLimit || 5);

	const currentGroupStart = $derived(
		Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit
	);
	const currentGroupEnd = $derived(Math.min(currentGroupStart + paginationMoreLimit, pageCount));
</script>

<div
	data-slot="data-grid-pagination"
	class={cn(
		'flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0',
		mergedProps?.className
	)}
>
	<div class="order-2 flex flex-wrap items-center space-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
		{#if isLoading}
			{#if mergedProps.sizesSkeleton}
				{@render mergedProps.sizesSkeleton?.()}
			{:else}
				<Skeleton class="h-8 w-44" />
			{/if}
		{:else}
			<div class="text-sm text-muted-foreground">{mergedProps.rowsPerPageLabel}</div>
			<Select
				allowDeselect={false}
				type="single"
				value={`${pageSize}`}
				onValueChange={(value) => {
					const newPageSize = Number(value);
					table.setPageSize(newPageSize);
				}}
			>
				<SelectTrigger class="w-fit" size="sm">
					{pageSize}
				</SelectTrigger>
				<SelectContent side="top" class="min-w-[50px]">
					{#each mergedProps.sizes as size (size)}
						<SelectItem value={`${size}`}>
							{size}
						</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/if}
	</div>
	<div
		class="order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0"
	>
		{#if isLoading}
			{#if mergedProps.infoSkeleton}
				{@render mergedProps.infoSkeleton?.()}
			{:else}
				<Skeleton class="h-8 w-60" />
			{/if}
		{:else}
			<div class="order-2 text-sm text-nowrap text-muted-foreground sm:order-1">
				{paginationInfo}
			</div>
			{#if pageCount > 1}
				<div class="order-1 flex items-center space-x-1 sm:order-2">
					<Button
						size="sm"
						variant="ghost"
						class={btnArrowClass}
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">{mergedProps.previousPageLabel}</span>
						<ChevronLeftIcon class="size-4" />
					</Button>

					{#if currentGroupStart > 0}
						<Button
							size="sm"
							class={btnBaseClass}
							variant="ghost"
							onclick={() => table.setPageIndex(currentGroupStart - 1)}
						>
							{mergedProps.ellipsisText}
						</Button>
					{/if}

					{#each Array.from({ length: currentGroupEnd - currentGroupStart }, (_, i) => currentGroupStart + i) as i}
						<Button
							size="sm"
							variant="ghost"
							class={cn(
								btnBaseClass,
								'text-muted-foreground',
								pageIndex === i && 'bg-accent text-accent-foreground'
							)}
							onclick={() => {
								if (pageIndex !== i) {
									table.setPageIndex(i);
								}
							}}
						>
							{i + 1}
						</Button>
					{/each}

					{#if currentGroupEnd < pageCount}
						<Button
							class={btnBaseClass}
							variant="ghost"
							size="sm"
							onclick={() => table.setPageIndex(currentGroupEnd)}
						>
							{mergedProps.ellipsisText}
						</Button>
					{/if}

					<Button
						size="sm"
						variant="ghost"
						class={btnArrowClass}
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">{mergedProps.nextPageLabel}</span>
						<ChevronRightIcon class="size-4" />
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>
