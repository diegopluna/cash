<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldContent, FieldError, FieldLabel } from '../ui/field';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

	let {
		field,
		options,
		placeholder,
		label,
		disabled = false
	}: {
		field: AnyFieldApi;
		options: { label: string; value: string }[];
		placeholder: string;
		label: string;
		disabled?: boolean;
	} = $props();

	let selectedLabel = $derived(
		options.find((opt) => opt.value === field.state.value)?.label ?? placeholder
	);

	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);
</script>

<Field orientation="responsive" data-invalid={isInvalid}>
	<FieldContent>
		<FieldLabel for={field.name}>{label}</FieldLabel>
		{#if isInvalid}
			<FieldError {errors} />
		{/if}
	</FieldContent>
	<Select
		type="single"
		name={field.name}
		value={field.state.value}
		onValueChange={field.handleChange}
		{disabled}
	>
		<SelectTrigger id={field.name} aria-invalid={isInvalid} class="min-w-[120px]" {disabled}>
			{selectedLabel}
		</SelectTrigger>
		<SelectContent>
			{#each options as option (option.value)}
				<SelectItem {...option} />
			{/each}
		</SelectContent>
	</Select>
</Field>
