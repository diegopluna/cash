<script lang="ts">
	import { dataGridContext } from '../context';

	const { table, props } = dataGridContext.get();
	const totalColumns = $derived(table.getAllColumns().length);
</script>

<tr>
	<td colspan={totalColumns} class="py-6 text-center text-muted-foreground">
		{#if props.emptyMessage}
			{#if typeof props.emptyMessage === 'string'}
				{props.emptyMessage}
			{:else}
				{@render props.emptyMessage?.()}
			{/if}
		{:else}
			No data available
		{/if}
	</td>
</tr>
