<script lang="ts">
	import { categoriesCollection } from '$lib/tanstack/db/categories-collection';
	import { eq, useLiveQuery } from '@tanstack/svelte-db';
	import { createColumns, defaultHiddenColumns, type CategoryWithParent } from './columns';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import CategoryForm from './category-form.svelte';
	import type { Category } from './schema';
	import { categoryTypeConfig } from './schema';
	import { uuidv7 } from 'uuidv7';
	import { toast } from 'svelte-sonner';
	import { confirmDelete, ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';

	// Query categories with parent name via self-join
	const query = useLiveQuery((q) => {
		const parentCategories = q.from({ parent: categoriesCollection }).select(({ parent }) => ({
			id: parent.id,
			name: parent.name
		}));

		return q
			.from({ category: categoriesCollection })
			.leftJoin({ parent: parentCategories }, ({ category, parent }) =>
				eq(category.parentId, parent.id)
			)
			.select(({ category, parent }) => ({
				...category,
				parentName: parent?.name ?? null,
				parentId: parent?.id ?? null
			}));
	});

	// Form state
	let formOpen = $state(false);
	let editingCategory = $state<Category | undefined>(undefined);

	// Create columns with callbacks
	const columns = createColumns({
		onEdit: (category) => {
			editingCategory = category;
			formOpen = true;
		},
		onDelete: (category) => {
			if (category.isSystem) {
				toast.error('System categories cannot be deleted');
				return;
			}

			confirmDelete({
				title: 'Delete Category',
				description: `Are you sure you want to delete "${category.name}"? This may affect transactions using this category.`,
				onConfirm: async () => {
					categoriesCollection.delete(category.id);
					toast.success(`"${category.name}" deleted successfully`);
				}
			});
		}
	});

	// Type options with icons for filter
	const typeOptions = Object.entries(categoryTypeConfig).map(([value, config]) => ({
		label: `${config.icon} ${config.label}`,
		value
	}));

	// System filter options
	const systemOptions = [
		{ label: '🔒 System', value: 'true' },
		{ label: '👤 User', value: 'false' }
	];

	// TODO: Maybe bring this handler into the form component itself
	function handleFormSuccess(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
		if (editingCategory) {
			// Update existing category
			categoriesCollection.update(editingCategory.id, (draft) => {
				draft.name = data.name;
				draft.type = data.type;
				draft.parentId = data.parentId;
				draft.icon = data.icon;
				draft.color = data.color;
				draft.isSystem = data.isSystem;
				draft.updatedAt = new Date();
			});
			toast.success(`"${data.name}" updated successfully`);
		} else {
			// Create new category
			const categoryToInsert = {
				...data,
				id: uuidv7(),
				createdAt: new Date(),
				updatedAt: new Date()
			};
			categoriesCollection.insert(categoryToInsert);
			toast.success(`"${data.name}" added successfully`);
		}
	}
</script>

<ConfirmDeleteDialog />
<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
				<p class="text-muted-foreground">
					Organize your transactions with income and expense categories
				</p>
			</div>
			<CategoryForm
				bind:open={formOpen}
				bind:category={editingCategory}
				onSuccess={handleFormSuccess}
			/>
		</header>
		<DataTable
			data={query.data}
			{columns}
			searchColumnId="name"
			filterPlaceholder="Search categories..."
			initialColumnVisibility={defaultHiddenColumns}
			facetedFilters={[
				{
					columnId: 'type',
					title: 'Type',
					options: typeOptions
				},
				{
					columnId: 'isSystem',
					title: 'Source',
					options: systemOptions
				}
			]}
		/>
	</div>
</div>
