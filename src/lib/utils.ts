import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};

export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // remove accents
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function formatCNPJ(value: string): string {
	const digits = value.replace(/\D/g, '').slice(0, 14);
	if (digits.length <= 2) return digits;
	if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
	if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
	if (digits.length <= 12)
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
	return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji
 * e.g., "BR" → "🇧🇷", "US" → "🇺🇸"
 */
export function countryCodeToFlag(code: string): string {
	if (!code || code.length !== 2) return '';
	const codePoints = code
		.toUpperCase()
		.split('')
		.map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
	return String.fromCodePoint(...codePoints);
}

export function formatLabel(str: string): string {
	return (
		str
			// Handle snake_case: replace underscores with spaces
			.replace(/_/g, ' ')
			// Handle PascalCase/camelCase: insert space before uppercase letters
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			// Handle consecutive uppercase (like URL, ID)
			.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
			// Capitalize first letter of each word
			.replace(/\b\w/g, (c) => c.toUpperCase())
	);
}


// TODO: Add tests for these functions
export function toCents(amount: number): number {
	return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
	return cents / 100;
}

export function formatMoney(
  cents: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(fromCents(cents));
}