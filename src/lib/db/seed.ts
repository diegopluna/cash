import { reset } from 'drizzle-seed';
import db from './database';
import { accounts, categories, institutions, transactions } from './schema';
import appSettings from './schema/settings';
import * as schema from './schema';
import { uuidv7 } from 'uuidv7';

export async function seed() {
	// @ts-ignore
	await reset(db, schema);
	// 1) App settings (single row)
	await db.insert(appSettings).values({
		id: '1',
		currencyCode: 'BRL',
		locale: 'pt-BR'
	});

	// 2) Some common Brazilian institutions (minimal)
	const commonInstitutions = await db
		.insert(institutions)
		.values([
			{
				id: uuidv7(),
				name: 'Banco do Brasil',
				type: 'bank',
				country: 'BR',
				isbp: '00000000'
			},
			{
				id: uuidv7(),
				name: 'Itaú',
				type: 'bank',
				country: 'BR',
				isbp: '60701190'
			},
			{
				id: uuidv7(),
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
			id: uuidv7(),
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
				id: uuidv7(),
				name: 'Moradia',
				type: 'expense',
				isSystem: true
			},
			{
				id: uuidv7(),
				name: 'Alimentação',
				type: 'expense',
				isSystem: true
			},
			{
				id: uuidv7(),
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
				id: uuidv7(),
				name: 'Supermercado',
				type: 'expense',
				parentId: alimentacao.id,
				isSystem: true
			},
			{
				id: uuidv7(),
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
			id: uuidv7(),
			name: 'Salário',
			type: 'income',
			isSystem: true
		})
		.returning();

	// 5) Example first transaction: a salary income
	await db.insert(transactions).values({
		id: uuidv7(),
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
