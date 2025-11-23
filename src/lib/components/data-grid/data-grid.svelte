<script lang="ts" generics="TData extends object">
	import type { Table } from '@tanstack/table-core';
	import { type DataGridProps } from './types';
	import { dataGridContext } from './context';

	let { children, table, ...props }: DataGridProps<TData> & { table: Table<TData> } = $props();

	const defaultProps: Partial<DataGridProps<TData>> = {
		loadingMode: 'skeleton',
		tableLayout: {
			dense: false,
			cellBorder: false,
			rowBorder: true,
			rowRounded: false,
			stripped: false,
			headerSticky: false,
			headerBackground: true,
			headerBorder: true,
			width: 'fixed',
			columnsVisibility: false,
			columnsResizable: false,
			columnsPinnable: false,
			columnsMovable: false,
			columnsDraggable: false,
			rowsDraggable: false
		},
		tableClass: {
			base: '',
			header: '',
			headerRow: '',
			headerSticky: 'sticky top-0 z-10 bg-background/90 backdrop-blur-xs',
			body: '',
			bodyRow: '',
			footer: '',
			edgeCell: ''
		}
	};

	const mergedProps: DataGridProps<TData> = {
		...defaultProps,
		...props,
		tableLayout: {
			...defaultProps.tableLayout,
			...(props.tableLayout || {})
		},
		tableClass: {
			...defaultProps.tableClass,
			...(props.tableClass || {})
		}
	};

	if (!table) {
		throw new Error('DataGrid requires a "table" prop');
	}

	dataGridContext.set({
		props: mergedProps,
		table,
		recordCount: mergedProps.recordCount,
		isLoading: mergedProps.isLoading || false
	});
</script>

{@render children?.()}
