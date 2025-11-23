import type { Column } from '@tanstack/table-core';
import { tv } from 'tailwind-variants';

export const headerCellSpacingVariants = tv({
	variants: {
		size: {
			dense: 'px-2.5 h-9',
			default: 'px-4'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});

export const bodyCellSpacingVariants = tv({
	variants: {
		size: {
			dense: 'px-2.5 py-2',
			default: 'px-4 py-3'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});

export function getPinningStyles<TData>(column: Column<TData>): string {
	const isPinned = column.getIsPinned();
	return [
		isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
		isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
		isPinned ? 'sticky' : 'relative',
		`width: ${column.getSize()}px;`,
		`z-index: ${isPinned ? 1 : 0};`
	]
		.filter(Boolean)
		.join(' ');
}

export function getCheckBoxSize(size: 'sm' | 'md' | 'lg'): string {
	switch (size) {
		case 'sm':
			return 'size-4.5 [&_svg]:size-3';
		case 'md':
			return 'size-5 [&_svg]:size-3.5';
		case 'lg':
			return 'size-5.5 [&_svg]:size-4';
		default:
			return 'size-5 [&_svg]:size-3.5';
	}
}
