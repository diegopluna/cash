<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { categoriesInsertSchema } from './schema';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import FormInput from '$lib/components/form/form-input.svelte';

	let { isEdit = false }: { isEdit?: boolean } = $props();

	const form = createForm(() => ({
		validators: {
			onChange: categoriesInsertSchema.omit({
				createdAt: true,
				updatedAt: true,
				id: true
			})
		},
		onSubmit: async (values) => {
			console.log(values);
		}
	}));
</script>

<Sheet>
	<SheetTrigger class={buttonVariants({ variant: 'default' })}>
		<Plus />
		Add Category
	</SheetTrigger>
	<SheetContent side="right">
		<SheetHeader>
			{#if isEdit}
				<SheetTitle>Edit Category</SheetTitle>
			{:else}
				<SheetTitle>Add Category</SheetTitle>
			{/if}
		</SheetHeader>
		<form>
			<div class="grid flex-1 auto-rows-min gap-6 px-4">
				<form.Field name="name">
					{#snippet children(field)}
						<FormInput {field} label="Name" />
					{/snippet}
				</form.Field>
			</div>
		</form>
	</SheetContent>
</Sheet>
