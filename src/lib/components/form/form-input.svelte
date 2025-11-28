<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldError, FieldLabel } from '../ui/field';
	import { Input } from '../ui/input';

	let {
		field,
		label,
		placeholder,
		maxLength,
		disabled = false
	}: {
		field: AnyFieldApi;
		label: string;
		placeholder?: string;
		maxLength?: number;
		disabled?: boolean;
	} = $props();

	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);
</script>

<Field data-invalid={isInvalid}>
	<FieldLabel for={field.name}>{label}</FieldLabel>
	<Input
		id={field.name}
		name={field.name}
		value={field.state.value}
		{placeholder}
		onblur={field.handleBlur}
		oninput={(e) => field.handleChange(e.currentTarget.value)}
		aria-invalid={isInvalid}
		autocomplete="off"
		maxlength={maxLength}
		{disabled}
	/>
	{#if isInvalid}
		<FieldError {errors} />
	{/if}
</Field>
