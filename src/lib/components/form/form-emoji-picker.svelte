<script lang="ts">
	import type { AnyFieldApi } from '@tanstack/svelte-form';
	import { Field, FieldError, FieldLabel } from '../ui/field';
	import { buttonVariants } from '../ui/button';
	import * as Popover from '../ui/popover';
	import * as EmojiPicker from '../ui/emoji-picker';
	import { SmilePlus, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let {
		field,
		label,
		placeholder = 'Select emoji'
	}: {
		field: AnyFieldApi;
		label: string;
		placeholder?: string;
	} = $props();

	let open = $state(false);

	const isInvalid = $derived.by(() => field.state.meta.isTouched && !field.state.meta.isValid);
	const errors = $derived.by(() =>
		field.state.meta.errors.map((error) => ({ message: error?.message }))
	);

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		field.handleChange('');
	}
</script>

<Field data-invalid={isInvalid}>
	<FieldLabel for={field.name}>{label}</FieldLabel>
	<div class="flex items-center gap-2">
		<EmojiPicker.Root
			disableInitialScroll
			value={field.state.value}
			onSelect={(selected) => {
				field.handleChange(selected.emoji);
				open = false;
			}}
		>
			<Popover.Root bind:open>
				<Popover.Trigger
					class={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-start gap-2')}
				>
					{#if field.state.value === ''}
						<SmilePlus class="h-4 w-4 text-muted-foreground" />
						<span class="text-muted-foreground">{placeholder}</span>
					{:else}
						<span class="text-lg">{field.state.value}</span>
						<span class="text-muted-foreground">{placeholder}</span>
					{/if}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0">
					<EmojiPicker.Search />
					<EmojiPicker.List />
				</Popover.Content>
			</Popover.Root>
		</EmojiPicker.Root>
		{#if field.state.value !== ''}
			<button
				type="button"
				onclick={handleClear}
				class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-9 w-9 shrink-0')}
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Clear emoji</span>
			</button>
		{/if}
	</div>
	{#if isInvalid}
		<FieldError {errors} />
	{/if}
</Field>
