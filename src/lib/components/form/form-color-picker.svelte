<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldLabel } from '../ui/field';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	let { field, label }: { field: AnyFieldApi; label: string } = $props();

	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);
</script>

<Field data-invalid={isInvalid}>
	<FieldLabel for={field.name}>{label}</FieldLabel>
	<ColorPicker
		hex={field.state.value}
		onInput={(e) => field.handleChange(e.hex)}
		--cp-bg-color="#333"
		--cp-border-color="white"
		--cp-text-color="white"
		--cp-input-color="#555"
		--cp-button-hover-color="#777"
	/>
</Field>
