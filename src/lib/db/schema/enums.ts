export const accountTypeEnum = [
	'checking',
	'savings',
	'wallet',
	'investment',
	'credit_card',
	'other'
] as const;

export const institutionTypeEnum = [
	'bank',
	'fintech',
	'broker',
	'digital_wallet',
	'other'
] as const;

export const categoryTypeEnum = ['income', 'expense', 'other'] as const;

export const frequencyEnum = ['daily', 'weekly', 'monthly', 'yearly'] as const;

export const transactionTypeEnum = ['income', 'expense', 'transfer', 'adjustment'] as const;

export const transactionStatusEnum = ['pending', 'cleared', 'cancelled'] as const;

export const paymentMethodEnum = [
	'pix',
	'boleto',
	'credit_card',
	'debit_card',
	'cash',
	'transfer',
	'ted_doc',
	'other'
] as const;
