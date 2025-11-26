<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldError, FieldLabel } from '../ui/field';
	import { Input } from '../ui/input';
	import { formatCNPJ } from '$lib/utils';

	let {
		field,
		label = 'CNPJ'
	}: {
		field: AnyFieldApi;
		label?: string;
	} = $props();

	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		const formatted = formatCNPJ(e.currentTarget.value);
		e.currentTarget.value = formatted;
		field.handleChange(formatted);
	}
</script>

<Field data-invalid={isInvalid}>
	<FieldLabel for={field.name}>{label}</FieldLabel>
	<Input
		id={field.name}
		name={field.name}
		type="text"
		placeholder="XX.XXX.XXX/XXXX-XX"
		value={field.state.value}
		onblur={field.handleBlur}
		oninput={handleInput}
		aria-invalid={isInvalid}
		autocomplete="off"
	/>
	{#if isInvalid}
		<FieldError {errors} />
	{/if}
</Field>
