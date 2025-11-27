<script lang="ts">
	import { institutionsCollection } from '$lib/tanstack/db/institutions-collection';
	import { accountsCollection } from '$lib/tanstack/db/accounts-collection';
	import { count, eq, useLiveQuery } from '@tanstack/svelte-db';
	import { createColumns, defaultHiddenColumns, type InstitutionWithCount } from './columns';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import InstitutionsForm from './institutions-form.svelte';
	import type { Institution } from './schema';
	import { uuidv7 } from 'uuidv7';
	import { toast } from 'svelte-sonner';
	import { institutionTypeConfig } from './schema';
	import countries from '$lib/countries';
	import { countryCodeToFlag } from '$lib/utils';
	import { confirmDelete, ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';
	import { goto } from '$app/navigation';

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

	// Form state
	let formOpen = $state(false);
	let editingInstitution = $state<Institution | undefined>(undefined);

	// Create columns with callbacks
	const columns = createColumns({
		onEdit: (institution) => {
			editingInstitution = institution;
			formOpen = true;
		},
		onDelete: (institution) => {
			// TODO: Add confirmation dialog

			confirmDelete({
				title: 'Delete Institution',
				description: `Are you sure you want to delete "${institution.name}"?`,
				onConfirm: async () => {
					institutionsCollection.delete(institution.id);
					toast.success(`"${institution.name}" deleted successfully`);
				}
			});
		},
		onDetails: (institution) => {
			goto(`/institutions/${institution.id}`);
		}
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

	// TODO: Maybe bring this handler into the form component itself to reduce prop drilling and avoid duplicate code
	// Maybe extract to a shared utility if used in multiple places
	function handleFormSuccess(data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) {
		if (editingInstitution) {
			// Update existing institution using draft pattern
			institutionsCollection.update(editingInstitution.id, (draft) => {
				draft.name = data.name;
				draft.type = data.type;
				draft.country = data.country;
				draft.slug = data.slug;
				draft.isbp = data.isbp;
				draft.cnpj = data.cnpj;
				draft.websiteUrl = data.websiteUrl;
				draft.logoUrl = data.logoUrl;
				draft.updatedAt = new Date();
			});
			toast.success(`"${data.name}" updated successfully`);
		} else {
			// Create new institution
			const institutionToInsert = {
				...data,
				id: uuidv7(),
				createdAt: new Date(),
				updatedAt: new Date()
			};
			institutionsCollection.insert(institutionToInsert);
			toast.success(`"${data.name}" added successfully`);
		}
	}
</script>

<!-- TODO: Add Loading State -->

<ConfirmDeleteDialog />
<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Institutions</h1>
				<p class="text-muted-foreground">Manage your banks, fintechs, and financial institutions</p>
			</div>
			<InstitutionsForm
				bind:open={formOpen}
				bind:institution={editingInstitution}
				onSuccess={handleFormSuccess}
			/>
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
