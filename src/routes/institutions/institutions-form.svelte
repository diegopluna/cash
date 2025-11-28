<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { institutionFormSchema, institutionTypeConfig, type Institution } from './schema';
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
	import { Plus, WandSparkles } from 'lucide-svelte';
	import FormInput from '$lib/components/form/form-input.svelte';
	import FormSelect from '$lib/components/form/form-select.svelte';
	import FormCountrySelect from '$lib/components/form/form-country-select.svelte';
	import FormCnpjInput from '$lib/components/form/form-cnpj-input.svelte';
	import { FieldSet, FieldLegend, FieldDescription } from '$lib/components/ui/field';
	import { Separator } from '$lib/components/ui/separator';
	import { generateSlug } from '$lib/utils';

	let {
		open = $bindable(false),
		institution = $bindable<Institution | undefined>(undefined),
		onSuccess = () => {},
		showTrigger = true
	}: {
		open?: boolean;
		institution?: Institution;
		onSuccess?: (institution: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => void;
		showTrigger?: boolean;
	} = $props();

	const isEdit = $derived(!!institution);

	let wasOpen = false;

	const form = createForm(() => ({
		defaultValues: {
			name: '',
			type: 'bank' as 'bank' | 'fintech' | 'broker' | 'digital_wallet' | 'other',
			country: 'BR',
			slug: '',
			isbp: '',
			cnpj: '',
			websiteUrl: '',
			logoUrl: ''
		},
		onSubmit: async ({ value }) => {
			const result = institutionFormSchema.safeParse(value);
			if (!result.success) {
				console.error('Validation failed:', result.error);
				return;
			}

			const cleanedValues = {
				...value,
				slug: value.slug || null,
				isbp: value.isbp || null,
				cnpj: value.cnpj || null,
				websiteUrl: value.websiteUrl || null,
				logoUrl: value.logoUrl || null
			};

			open = false;
			onSuccess(cleanedValues);

			institution = undefined;
		}
	}));

	$effect.pre(() => {
		if (open && !wasOpen) {
			wasOpen = true;

			form.setFieldValue('name', institution?.name ?? '');
			form.setFieldValue('type', institution?.type ?? 'bank');
			form.setFieldValue('country', institution?.country ?? 'BR');
			form.setFieldValue('slug', institution?.slug ?? '');
			form.setFieldValue('isbp', institution?.isbp ?? '');
			form.setFieldValue('cnpj', institution?.cnpj ?? '');
			form.setFieldValue('websiteUrl', institution?.websiteUrl ?? '');
			form.setFieldValue('logoUrl', institution?.logoUrl ?? '');
		}

		if (!open && wasOpen) {
			wasOpen = false;
		}
	});

	const isBrazil = form.useStore((state) => state.values.country === 'BR');
	const hasName = form.useStore((state) => state.values.name.trim().length > 0);

	const typeOptions = Object.entries(institutionTypeConfig).map(([value, config]) => ({
		value,
		label: `${config.icon} ${config.label}`
	}));

	function handleGenerateSlug() {
		const name = form.state.values.name;
		if (name) {
			const slug = generateSlug(name);
			form.setFieldValue('slug', slug);
		}
	}

	function handleOpenChange(isOpen: boolean) {
		open = isOpen;
		if (!isOpen) {
			institution = undefined;
		}
	}
</script>

<Sheet {open} onOpenChange={handleOpenChange}>
	{#if showTrigger}
		<SheetTrigger class={buttonVariants({ variant: 'default' })}>
			<Plus />
			Add Institution
		</SheetTrigger>
	{/if}
	<SheetContent side="right" class="flex flex-col">
		<SheetHeader>
			{#if isEdit}
				<SheetTitle>Edit Institution</SheetTitle>
			{:else}
				<SheetTitle>Add Institution</SheetTitle>
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
							onChange: institutionFormSchema.shape.name
						}}
					>
						{#snippet children(field)}
							<FormInput {field} label="Name" placeholder="e.g. Nubank" />
						{/snippet}
					</form.Field>

					<div class="grid grid-cols-2 gap-4">
						<form.Field name="type" validators={{ onChange: institutionFormSchema.shape.type }}>
							{#snippet children(field)}
								<FormSelect {field} placeholder="Select type" label="Type" options={typeOptions} />
							{/snippet}
						</form.Field>

						<form.Field name="country">
							{#snippet children(field)}
								<FormCountrySelect {field} />
							{/snippet}
						</form.Field>
					</div>

					<form.Field
						name="slug"
						validators={{
							onChange: ({ value }) => {
								if (value && !/^[a-z0-9-]*$/.test(value)) {
									return 'Only lowercase letters, numbers, and hyphens';
								}
								return undefined;
							}
						}}
					>
						{#snippet children(field)}
							<div class="space-y-2">
								<FormInput {field} label="Slug" placeholder="e.g. nubank" />
								<div class="flex items-center gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onclick={handleGenerateSlug}
										disabled={!hasName.current}
									>
										<WandSparkles class="mr-1 h-3 w-3" />
										Auto-generate
									</Button>
									<FieldDescription class="text-xs">URL-friendly identifier</FieldDescription>
								</div>
							</div>
						{/snippet}
					</form.Field>
				</FieldSet>

				<!-- Brazilian Identifiers (conditional) -->
				{#if isBrazil.current}
					<Separator />

					<FieldSet>
						<FieldLegend>🇧🇷 Brazilian Identifiers</FieldLegend>
						<FieldDescription>
							Optional fields for Brazilian financial institutions
						</FieldDescription>

						<div class="grid grid-cols-2 gap-4">
							<form.Field
								name="isbp"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\d{8}$/.test(value)) {
											return 'ISPB must be 8 digits';
										}
										return undefined;
									}
								}}
							>
								{#snippet children(field)}
									<div class="space-y-1">
										<FormInput {field} label="ISPB Code" placeholder="00000000" maxLength={8} />
										<FieldDescription class="text-xs">8-digit Central Bank code</FieldDescription>
									</div>
								{/snippet}
							</form.Field>

							<form.Field
								name="cnpj"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})?$/.test(value)) {
											return 'Invalid CNPJ format';
										}
										return undefined;
									}
								}}
							>
								{#snippet children(field)}
									<div class="space-y-1">
										<FormCnpjInput {field} />
										<FieldDescription class="text-xs">Company registry number</FieldDescription>
									</div>
								{/snippet}
							</form.Field>
						</div>
					</FieldSet>
				{/if}

				<!-- Additional Information -->
				<Separator />

				<FieldSet>
					<FieldLegend>Additional Information</FieldLegend>
					<FieldDescription>Optional details about the institution</FieldDescription>

					<form.Field
						name="websiteUrl"
						validators={{
							onChange: ({ value }) => {
								if (value && !/^https?:\/\/.+/.test(value)) {
									return 'Invalid URL (must start with http:// or https://)';
								}
								return undefined;
							}
						}}
					>
						{#snippet children(field)}
							<FormInput {field} label="Website URL" placeholder="https://example.com" />
						{/snippet}
					</form.Field>

					<form.Field
						name="logoUrl"
						validators={{
							onChange: ({ value }) => {
								if (value && !/^https?:\/\/.+/.test(value)) {
									return 'Invalid URL (must start with http:// or https://)';
								}
								return undefined;
							}
						}}
					>
						{#snippet children(field)}
							<FormInput {field} label="Logo URL" placeholder="https://example.com/logo.png" />
						{/snippet}
					</form.Field>
				</FieldSet>
			</div>

			<SheetFooter class="mt-auto border-t pt-4">
				<SheetClose class={buttonVariants({ variant: 'outline' })}>Cancel</SheetClose>
				<Button type="submit" disabled={!form.state.canSubmit}>
					{isEdit ? 'Save Changes' : 'Create Institution'}
				</Button>
			</SheetFooter>
		</form>
	</SheetContent>
</Sheet>
