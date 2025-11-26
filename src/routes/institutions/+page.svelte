<script lang="ts">
	import { institutionsCollection } from '$lib/tanstack/db/institutions-collection';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { columns } from './columns';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import InstitutionsForm from './institutions-form.svelte';
	import type { Institution } from './schema';
	import { uuidv7 } from 'uuidv7';
	import { toast } from 'svelte-sonner';

	const query = useLiveQuery((q) => q.from({ institutions: institutionsCollection }));

	function handleSuccess(institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) {
		const institutionToInsert = {
			...institution,
			id: uuidv7(),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		institutionsCollection.insert(institutionToInsert);

		toast.success('Institution added successfully');
	}
</script>

<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Institutions</h1>
			</div>
			<InstitutionsForm onSuccess={handleSuccess} />
		</header>
		<DataTable
			data={query.data}
			{columns}
			searchColumnId="name"
			filterPlaceholder="Search institutions..."
			facetedFilters={[
				{
					columnId: 'type',
					title: 'Type',
					options: [
						{ label: 'Bank', value: 'bank' },
						{ label: 'Fintech', value: 'fintech' },
						{ label: 'Broker', value: 'broker' },
						{ label: 'Digital Wallet', value: 'digital_wallet' },
						{ label: 'Other', value: 'other' }
					]
				}
			]}
		/>
	</div>
</div>
