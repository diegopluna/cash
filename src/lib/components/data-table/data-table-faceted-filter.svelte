<script lang="ts" generics="TData, TValue">
	import type { Column } from '@tanstack/table-core';
	import type { Component } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
	import { Button } from '../ui/button';
	import { Check, CirclePlus } from 'lucide-svelte';
	import { Separator } from '../ui/separator';
	import { Badge } from '../ui/badge';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '../ui/command';
	import { cn } from '$lib/utils';

	let {
		column,
		title,
		options
	}: {
		column: Column<TData, TValue>;
		title: string;
		options: {
			label: string;
			value: string;
			icon?: Component;
		}[];
	} = $props();

	const facets = $derived(column?.getFacetedUniqueValues());
	const selectedValues = $derived(new SvelteSet(column?.getFilterValue() as string[]));
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<CirclePlus />
				{title}
				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedValues.size}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{selectedValues.size} selected
							</Badge>
						{:else}
							{#each options.filter((opt) => selectedValues.has(opt.value)) as option (option)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent class="w-[200px] p-0" align="start">
		<Command>
			<CommandInput placeholder={title} />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{#each options as option (option)}
						{@const isSelected = selectedValues.has(option.value)}
						<CommandItem
							onSelect={() => {
								if (isSelected) {
									selectedValues.delete(option.value);
								} else {
									selectedValues.add(option.value);
								}
								const filterValues = Array.from(selectedValues);
								column?.setFilterValue(filterValues.length ? filterValues : undefined);
							}}
						>
							<div
								class={cn(
									'me-2 flex size-4 items-center justify-center rounded-sm border border-primary',
									isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class="size-4" />
							</div>
							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="text-muted-foreground" />
							{/if}
							{#if facets?.get(option.value)}
								<span class="ms-auto flex size-4 items-center justify-center font-mono text-xs">
									{facets.get(option.value)}
								</span>
							{:else}
								<span class="ms-auto flex size-4 items-center justify-center font-mono text-xs"
									>0</span
								>
							{/if}
							<span>{option.label}</span>
						</CommandItem>
					{/each}
				</CommandGroup>
				{#if selectedValues.size > 0}
					<CommandSeparator />
					<CommandGroup>
						<CommandItem
							onSelect={() => column?.setFilterValue(undefined)}
							class="justify-center text-center"
						>
							Clear filters
						</CommandItem>
					</CommandGroup>
				{/if}
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
