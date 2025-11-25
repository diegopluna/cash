<script lang="ts" generics>
	import { XIcon } from 'lucide-svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { dataTableContext } from './context';
	import type { Component } from 'svelte';
	import DataTableFacetedFilter from './data-table-faceted-filter.svelte';
	import DataTableViewOptions from './data-table-view-options.svelte';

	type DataTableToolbarProps = {
		filterPlaceholder: string;
		searchColumnId: string;
		facetedFilters?: {
			columnId: string;
			title: string;
			options: {
				label: string;
				value: string;
				icon?: Component;
			}[];
		}[];
	};

	let { filterPlaceholder, searchColumnId, facetedFilters }: DataTableToolbarProps = $props();

	const table = dataTableContext.get();
	const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			placeholder={filterPlaceholder}
			value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''}
			oninput={(e) => {
				table.getColumn(searchColumnId)?.setFilterValue(e.currentTarget.value);
			}}
			onchange={(e) => {
				table.getColumn(searchColumnId)?.setFilterValue(e.currentTarget.value);
			}}
			class="h-8 w-[150px] lg:w-[250px]"
		/>

		{#each facetedFilters as facetedFilter}
			{@const column = table.getColumn(facetedFilter.columnId)}
			{#if column}
				<DataTableFacetedFilter
					{column}
					title={facetedFilter.title}
					options={facetedFilter.options}
				/>
			{/if}
		{/each}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Reset
				<XIcon />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions />
</div>
