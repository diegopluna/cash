<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldContent, FieldError, FieldLabel } from '../ui/field';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
	import countries from '$lib/countries';

	let { field }: { field: AnyFieldApi } = $props();

	let selectedLabel = $derived(
		countries.find((country) => country.code === field.state.value)?.name ?? 'Select country'
	);
	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);
</script>

<Field orientation="responsive" data-invalid={isInvalid}>
	<FieldContent>
		<FieldLabel for={field.name}>Country</FieldLabel>
		{#if isInvalid}
			<FieldError {errors} />
		{/if}
	</FieldContent>
	<Select
		type="single"
		name={field.name}
		value={field.state.value}
		onValueChange={field.handleChange}
	>
		<SelectTrigger id={field.name} aria-invalid={isInvalid} class="min-w-[120px]">
			{selectedLabel}
		</SelectTrigger>
		<SelectContent>
			{#each countries as country}
				<SelectItem value={country.code} label={country.name} />
			{/each}
		</SelectContent>
	</Select>
</Field>
