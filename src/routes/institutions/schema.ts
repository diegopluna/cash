import { institutions } from '$lib/db/schema';
import { institutionTypeEnum } from '$lib/db/schema/enums';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const institutionsInsertSchema = createInsertSchema(institutions, {
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	type: z.enum(institutionTypeEnum),
	slug: z
		.string()
		.regex(/^[a-z0-9-]*$/, 'Only lowercase letters, numbers, and hyphens')
		.max(100)
		.nullable()
		.optional(),
	isbp: z
		.string()
		.regex(/^(\d{8})?$/, 'ISPB must be 8 digits')
		.nullable()
		.optional(),
	cnpj: z
		.string()
		.regex(/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})?$/, 'Invalid CNPJ format')
		.nullable()
		.optional(),
	websiteUrl: z.url('Invalid URL').nullable().optional(),
	logoUrl: z.url('Invalid URL').nullable().optional()
});

export const institutionFormSchema = institutionsInsertSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export type Institution = typeof institutions.$inferSelect;
export type InstitutionFormValues = z.infer<typeof institutionFormSchema>;

export const institutionTypeConfig = {
	bank: { label: 'Bank', icon: '🏦' },
	fintech: { label: 'Fintech', icon: '💳' },
	broker: { label: 'Broker', icon: '📈' },
	digital_wallet: { label: 'Digital Wallet', icon: '📱' },
	other: { label: 'Other', icon: '📁' }
} as const;
