import { createInsertSchema } from 'drizzle-zod';
import { categories } from '$lib/db/schema';

// TODO: Add richer validation rules

export const categoriesInsertSchema = createInsertSchema(categories);
export type Category = typeof categories.$inferSelect;

// Type configuration with icons and colors for badges
export const categoryTypeConfig = {
	income: {
		label: 'Income',
		icon: '💰',
		badgeClass: 'bg-emerald-900/70 text-emerald-300 border-emerald-700'
	},
	expense: {
		label: 'Expense',
		icon: '💸',
		badgeClass: 'bg-rose-900/70 text-rose-300 border-rose-700'
	},
	other: {
		label: 'Other',
		icon: '📦',
		badgeClass: 'bg-zinc-700/80 text-zinc-300 border-zinc-600'
	}
} as const;

export type CategoryType = keyof typeof categoryTypeConfig;
