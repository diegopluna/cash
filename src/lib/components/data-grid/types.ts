import type { ColumnFiltersState, RowData, SortingState, Table } from '@tanstack/table-core';
import type { Snippet } from 'svelte';

declare module '@tanstack/table-core' {
	interface ColumnMeta<TData extends RowData, TValue> {
		headerTitle?: string;
		headerClass?: string;
		cellClass?: string;
		skeleton?: Snippet;
		expandedContent?: (row: TData) => Snippet;
	}
}

export type DataGridApiFetchParams = {
	pageIndex: number;
	pageSize: number;
	sorting?: SortingState;
	filters?: ColumnFiltersState;
	searchQuery?: string;
};

export type DataGridApiResponse<T> = {
	data: T[];
	empty: boolean;
	pagination: {
		total: number;
		page: number;
	};
};

export interface DataGridContextProps<TData extends object> {
	props: DataGridProps<TData>;
	table: Table<TData>;
	recordCount: number;
	isLoading: boolean;
}

export type DataGridRequestParams = {
	pageIndex: number;
	pageSize: number;
	sorting?: SortingState;
	columnFilters?: ColumnFiltersState;
};

export interface DataGridProps<TData extends object> {
	class?: string;
	table?: Table<TData>;
	recordCount: number;
	children?: Snippet;
	onRowClick?: (row: TData) => void;
	isLoading?: boolean;
	loadingMode?: 'skeleton' | 'spinner';
	loadingMessage?: Snippet | string;
	emptyMessage?: Snippet | string;
	tableLayout?: {
		dense?: boolean;
		cellBorder?: boolean;
		rowBorder?: boolean;
		rowRounded?: boolean;
		stripped?: boolean;
		headerBackground?: boolean;
		headerBorder?: boolean;
		headerSticky?: boolean;
		width?: 'auto' | 'fixed';
		columnsVisibility?: boolean;
		columnsResizable?: boolean;
		columnsPinnable?: boolean;
		columnsMovable?: boolean;
		columnsDraggable?: boolean;
		rowsDraggable?: boolean;
	};
	tableClass?: {
		base?: string;
		header?: string;
		headerRow?: string;
		headerSticky?: string;
		body?: string;
		bodyRow?: string;
		footer?: string;
		edgeCell?: string;
	};
}
