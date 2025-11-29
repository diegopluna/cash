<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { categoriesInsertSchema, categoryTypeConfig, type Category } from './schema';
	import {
		Sheet,
		SheetClose,
		SheetContent,
		SheetFooter,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import FormInput from '$lib/components/form/form-input.svelte';
	import FormSelect from '$lib/components/form/form-select.svelte';
	import FormEmojiPicker from '$lib/components/form/form-emoji-picker.svelte';
	import { FieldSet, FieldLegend, FieldDescription } from '$lib/components/ui/field';
	import { Separator } from '$lib/components/ui/separator';
	import { categoriesCollection } from '$lib/tanstack/db/categories-collection';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { z } from 'zod';

	let {
		open = $bindable(false),
		category = $bindable<Category | undefined>(undefined),
		onSuccess = () => {},
		showTrigger = true
	}: {
		open?: boolean;
		category?: Category;
		onSuccess?: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
		showTrigger?: boolean;
	} = $props();

	const isEdit = $derived(!!category);

	// Get all categories for parent select (excluding the current category if editing)
	const categoriesQuery = useLiveQuery((q) => q.from({ categories: categoriesCollection }));
	const parentOptions = $derived.by(() => {
		const categories = categoriesQuery.data ?? [];
		return categories
			.filter((c) => c.id !== category?.id) // Exclude self
			.map((c) => ({
				value: c.id,
				label: `${c.icon ?? '📁'} ${c.name}`
			}));
	});

	let wasOpen = false;

	// Form validation schema
	const categoryFormSchema = z.object({
		name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
		type: z.enum(['income', 'expense', 'other']),
		parentId: z.string().nullable(),
		icon: z.string().nullable(),
		color: z.string().nullable(),
		isSystem: z.boolean()
	});

	const form = createForm(() => ({
		defaultValues: {
			name: '',
			type: 'expense' as 'income' | 'expense' | 'other',
			parentId: null as string | null,
			icon: '',
			color: '',
			isSystem: false
		},
		onSubmit: async ({ value }) => {
			const result = categoryFormSchema.safeParse(value);
			if (!result.success) {
				console.error('Validation failed:', result.error);
				return;
			}

			const cleanedValues = {
				...value,
				parentId: value.parentId || null,
				icon: value.icon || null,
				color: value.color || null
			};

			open = false;
			onSuccess(cleanedValues);

			category = undefined;
		}
	}));

	$effect.pre(() => {
		if (open && !wasOpen) {
			wasOpen = true;

			form.setFieldValue('name', category?.name ?? '');
			form.setFieldValue('type', category?.type ?? 'expense');
			form.setFieldValue('parentId', category?.parentId ?? null);
			form.setFieldValue('icon', category?.icon ?? '');
			form.setFieldValue('color', category?.color ?? '');
			form.setFieldValue('isSystem', category?.isSystem ?? false);
		}

		if (!open && wasOpen) {
			wasOpen = false;
		}
	});

	const typeOptions = Object.entries(categoryTypeConfig).map(([value, config]) => ({
		value,
		label: `${config.icon} ${config.label}`
	}));

	function handleOpenChange(isOpen: boolean) {
		open = isOpen;
		if (!isOpen) {
			category = undefined;
		}
	}

	// Check if editing a system category (should disable certain fields)
	const isSystemCategory = $derived(category?.isSystem ?? false);
</script>

<Sheet {open} onOpenChange={handleOpenChange}>
	{#if showTrigger}
		<SheetTrigger class={buttonVariants({ variant: 'default' })}>
			<Plus />
			Add Category
		</SheetTrigger>
	{/if}
	<SheetContent side="right" class="flex flex-col">
		<SheetHeader>
			{#if isEdit}
				<SheetTitle>Edit Category</SheetTitle>
			{:else}
				<SheetTitle>Add Category</SheetTitle>
			{/if}
		</SheetHeader>

		<form
			class="flex flex-1 flex-col overflow-hidden"
			onsubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div class="flex-1 space-y-6 overflow-y-auto px-4 py-2">
				<!-- Basic Information -->
				<FieldSet>
					<FieldLegend>Basic Information</FieldLegend>

					<form.Field
						name="name"
						validators={{
							onChange: categoryFormSchema.shape.name
						}}
					>
						{#snippet children(field)}
							<FormInput
								{field}
								label="Name"
								placeholder="e.g. Groceries"
								disabled={isSystemCategory}
							/>
						{/snippet}
					</form.Field>

					<form.Field name="type" validators={{ onChange: categoryFormSchema.shape.type }}>
						{#snippet children(field)}
							<FormSelect
								{field}
								placeholder="Select type"
								label="Type"
								options={typeOptions}
								disabled={isSystemCategory}
							/>
						{/snippet}
					</form.Field>

					<form.Field name="parentId">
						{#snippet children(field)}
							<FormSelect
								{field}
								placeholder="None (top-level)"
								label="Parent Category"
								options={parentOptions}
								disabled={isSystemCategory}
							/>
						{/snippet}
					</form.Field>
				</FieldSet>

				<!-- Appearance -->
				<Separator />

				<FieldSet>
					<FieldLegend>Appearance</FieldLegend>
					<FieldDescription>Customize how this category appears</FieldDescription>

					<form.Field name="icon">
						{#snippet children(field)}
							<FormEmojiPicker {field} label="Icon" placeholder="Select icon" />
						{/snippet}
					</form.Field>

					<form.Field name="color">
						{#snippet children(field)}
							<FormInput {field} label="Color" placeholder="#4F46E5" />
						{/snippet}
					</form.Field>

					<FieldDescription class="text-xs">
						Choose an emoji for the icon and a hex color code for the color
					</FieldDescription>
				</FieldSet>

				{#if isSystemCategory}
					<div
						class="rounded-md border border-amber-700/50 bg-amber-900/20 p-3 text-sm text-amber-300"
					>
						<strong>System Category:</strong> Core fields cannot be modified, but you can customize the
						appearance.
					</div>
				{/if}
			</div>

			<SheetFooter class="mt-auto border-t pt-4">
				<SheetClose class={buttonVariants({ variant: 'outline' })}>Cancel</SheetClose>
				<Button type="submit" disabled={!form.state.canSubmit}>
					{isEdit ? 'Save Changes' : 'Create Category'}
				</Button>
			</SheetFooter>
		</form>
	</SheetContent>
</Sheet>
