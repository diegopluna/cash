<script lang="ts">
	import { box } from 'svelte-toolbelt';
	import { useEmojiPickerSkinToneSelector } from './emoji-picker.svelte.js';
	import type { EmojiPickerSkinProps } from './types.js';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';

	let {
		previewEmoji = '👋',
		variant = 'outline',
		size = 'icon',
		class: className,
		onclick: onclickProp,
		...rest
	}: EmojiPickerSkinProps = $props();

	const skinState = useEmojiPickerSkinToneSelector({
		previewEmoji: box.with(() => previewEmoji)
	});
</script>

<Button
	{...rest}
	{variant}
	{size}
	class={cn('size-8', className)}
	onclick={(e) => {
		onclickProp?.(e as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
		skinState.cycleSkinTone();
	}}
>
	{skinState.preview}
</Button>
