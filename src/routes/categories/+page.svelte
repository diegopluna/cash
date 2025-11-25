<script lang="ts">
	import { categoriesCollection } from '$lib/tanstack/db/categories-collection';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { columns } from './columns';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import CategoryForm from './category-form.svelte';

	const query = useLiveQuery((q) => q.from({ categories: categoriesCollection }));
</script>

<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
			</div>
			<CategoryForm />
		</header>
		<DataTable
			data={query.data}
			{columns}
			searchColumnId="name"
			filterPlaceholder="Search categories..."
			facetedFilters={[
				{
					columnId: 'type',
					title: 'Type',
					options: [
						{ label: 'Expense', value: 'expense' },
						{ label: 'Income', value: 'income' }
					]
				}
			]}
		/>
	</div>
</div>
