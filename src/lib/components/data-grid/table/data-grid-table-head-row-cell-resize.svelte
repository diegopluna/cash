<script lang="ts" generics="TData extends object">
	import type { Header } from '@tanstack/table-core';

	let { header }: { header: Header<TData, unknown> } = $props();
	const { column } = header;
</script>

<div
	role="button"
	tabindex="0"
	ondblclick={() => column.resetSize()}
	onmousedown={header.getResizeHandler()}
	ontouchstart={header.getResizeHandler()}
	class="user-select-none absolute -end-2 top-0 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border"
></div>
