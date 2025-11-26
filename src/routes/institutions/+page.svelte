<script lang="ts">
	import { institutionsCollection } from '$lib/tanstack/db/institutions-collection';
	import { accountsCollection } from '$lib/tanstack/db/accounts-collection';
	import { count, eq, useLiveQuery } from '@tanstack/svelte-db';
	import { columns, defaultHiddenColumns, type InstitutionWithCount } from './columns';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import InstitutionsForm from './institutions-form.svelte';
	import type { Institution } from './schema';
	import { uuidv7 } from 'uuidv7';
	import { toast } from 'svelte-sonner';
	import { institutionTypeConfig } from './schema';
	import countries from '$lib/countries';
	import { countryCodeToFlag } from '$lib/utils';

	const query = useLiveQuery((q) => {
		const accountCounts = q
			.from({ account: accountsCollection })
			.groupBy(({ account }) => account.institutionId)
			.select(({ account }) => ({
				institutionId: account.institutionId,
				accountCount: count(account)
			}));

		return q
			.from({ institution: institutionsCollection })
			.leftJoin({ accountCount: accountCounts }, ({ institution, accountCount }) =>
				eq(institution.id, accountCount.institutionId)
			)
			.select(({ institution, accountCount }) => ({
				...institution,
				accountCount: accountCount?.accountCount ?? 0
			}));
	});

	// Get unique countries from data for filter options
	const countryOptions = $derived.by(() => {
		const institutions = query.data ?? [];
		const uniqueCodes = [...new Set(institutions.map((i) => i.country))];

		return uniqueCodes
			.map((code) => {
				const country = countries.find((c) => c.code === code);
				return {
					label: `${countryCodeToFlag(code)} ${country?.name ?? code}`,
					value: code
				};
			})
			.sort((a, b) => a.label.localeCompare(b.label));
	});

	// Type options with icons
	const typeOptions = Object.entries(institutionTypeConfig).map(([value, config]) => ({
		label: `${config.icon} ${config.label}`,
		value
	}));

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
				<p class="text-muted-foreground">Manage your banks, fintechs, and financial institutions</p>
			</div>
			<InstitutionsForm onSuccess={handleSuccess} />
		</header>
		<DataTable
			data={query.data}
			{columns}
			searchColumnId="name"
			filterPlaceholder="Search institutions..."
			initialColumnVisibility={defaultHiddenColumns}
			facetedFilters={[
				{
					columnId: 'type',
					title: 'Type',
					options: typeOptions
				},
				{
					columnId: 'country',
					title: 'Country',
					options: countryOptions
				}
			]}
		/>
	</div>
</div>
