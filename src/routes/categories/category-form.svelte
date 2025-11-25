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
	import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';

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
						{@const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid}
						<Field data-invalid={isInvalid}>
							<FieldLabel for={field.name}>Name</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onblur={field.handleBlur}
								onchange={field.handleChange}
								aria-invalid={isInvalid}
								autocomplete="off"
							/>
							<!-- {#if isInvalid}
                <FieldError errors={field.state.meta.errors.toString()} />
              {/if} -->
						</Field>
					{/snippet}
				</form.Field>
			</div>
		</form>
	</SheetContent>
</Sheet>
