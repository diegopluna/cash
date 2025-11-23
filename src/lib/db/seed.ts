import { reset } from 'drizzle-seed';
import db from './database';
import { accounts, categories, institutions, transactions } from './schema';
import appSettings from './schema/settings';
import * as schema from './schema';

export async function seed() {
	// @ts-ignore
	await reset(db, schema);
	// 1) App settings (single row)
	await db.insert(appSettings).values({
		currencyCode: 'BRL',
		locale: 'pt-BR'
	});

	// 2) Some common Brazilian institutions (minimal)
	const commonInstitutions = await db
		.insert(institutions)
		.values([
			{
				name: 'Banco do Brasil',
				type: 'bank',
				country: 'BR',
				isbp: '00000000'
			},
			{
				name: 'Itaú',
				type: 'bank',
				country: 'BR',
				isbp: '60701190'
			},
			{
				name: 'Nubank',
				type: 'fintech',
				country: 'BR',
				isbp: '18236120'
			}
		])
		.returning();

	const nubank = commonInstitutions.find((i) => i.name === 'Nubank');

	// 3) Default main account
	const [mainAccount] = await db
		.insert(accounts)
		.values({
			institutionId: nubank?.id,
			name: 'Conta Principal',
			type: 'checking',
			currencyCode: 'BRL',
			initialBalanceCents: 0,
			currentBalanceCents: 0,
			includeInNetWorth: true,
			includeInCashFlow: true
		})
		.returning();

	// 4) Base categories
	const baseExpenseCategories = await db
		.insert(categories)
		.values([
			{
				name: 'Moradia',
				type: 'expense',
				isSystem: true
			},
			{
				name: 'Alimentação',
				type: 'expense',
				isSystem: true
			},
			{
				name: 'Transporte',
				type: 'expense',
				isSystem: true
			}
		])
		.returning();

	const alimentacao = baseExpenseCategories.find((c) => c.name === 'Alimentação');

	if (alimentacao) {
		await db.insert(categories).values([
			{
				name: 'Supermercado',
				type: 'expense',
				parentId: alimentacao.id,
				isSystem: true
			},
			{
				name: 'Restaurantes',
				type: 'expense',
				parentId: alimentacao.id,
				isSystem: true
			}
		]);
	}

	// Basic income category
	const [salaryCategory] = await db
		.insert(categories)
		.values({
			name: 'Salário',
			type: 'income',
			isSystem: true
		})
		.returning();

	// 5) Example first transaction: a salary income
	await db.insert(transactions).values({
		accountId: mainAccount.id,
		type: 'income',
		status: 'cleared',
		amountCents: 5000_00, // R$ 5.000,00
		currencyCode: 'BRL',
		description: 'Primeiro salário',
		originalDescription: 'Depósito salário empresa X',
		date: new Date(), // today, stored as timestamp_ms
		paymentMethod: 'transfer',
		categoryId: salaryCategory.id
	});
}
