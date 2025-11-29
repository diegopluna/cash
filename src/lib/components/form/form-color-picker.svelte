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
		textInputModes={['hex']}
		--cp-bg-color="#121212"
		--cp-border-color="#222222"
		--cp-text-color="#c1c1c1"
		--cp-input-color="#222222"
	/>
</Field>
