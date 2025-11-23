import { Context } from 'runed';
import type { DataGridContextProps } from './types';

export const dataGridContext = new Context<DataGridContextProps<any>>('data-grid');
