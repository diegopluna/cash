<script lang="ts">
	import { eq, useLiveQuery } from '@tanstack/svelte-db';
	import type { PageProps } from './$types';
	import { institutionsCollection } from '$lib/tanstack/db/institutions-collection';
	import { ArrowLeftIcon, PencilIcon } from 'lucide-svelte';
	import CellBadge from '../cell-badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Institution } from '../schema';
	import InstitutionsForm from '../institutions-form.svelte';
	import { toast } from 'svelte-sonner';

	let { params }: PageProps = $props();

	const query = useLiveQuery((q) =>
		q
			.from({ institution: institutionsCollection })
			.where(({ institution }) => eq(institution.id, params.id))
	);

	let institution = $derived(query.data[0]);

	let formOpen = $state(false);
	let editingInstitution = $state<Institution | undefined>(undefined);

	function handleFormSuccess(data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) {
		institutionsCollection.update(editingInstitution?.id, (draft) => {
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
	}
</script>

<InstitutionsForm
	bind:open={formOpen}
	bind:institution={editingInstitution}
	onSuccess={handleFormSuccess}
	showTrigger={false}
/>
<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="space-y-4">
			<a
				href="/institutions"
				class="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
			>
				<ArrowLeftIcon class="h-4 w-4" />
				Back to institutions
			</a>
			<div class="flex w-full items-center gap-2">
				<h1 class="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
					<img src={institution?.logoUrl} alt={institution?.name} class="h-10 w-10 rounded-sm" />
					{institution?.name}
					<CellBadge title={institution?.type} variant={institution?.type} />
				</h1>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					onclick={() => {
						editingInstitution = institution;
						formOpen = true;
					}}
				>
					<PencilIcon class="h-4 w-4" />
					Edit
				</Button>
			</div>
		</header>
	</div>
</div>
