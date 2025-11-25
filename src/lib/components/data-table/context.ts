import type { Table } from '@tanstack/table-core';
import { Context } from 'runed';

export const dataTableContext = new Context<Table<any>>('data-table-context');
