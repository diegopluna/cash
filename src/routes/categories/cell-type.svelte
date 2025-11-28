<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const cellTypeVariants = tv({
		base: 'capitalize',
		variants: {
			variant: {
				income: 'bg-emerald-900/70 text-emerald-300 border-emerald-700',
				expense: 'bg-rose-900/70 text-rose-300 border-rose-700',
				other: 'bg-zinc-700/80 text-zinc-300 border-zinc-600'
			}
		},
		defaultVariants: {
			variant: 'expense'
		}
	});

	export type CellTypeVariant = VariantProps<typeof cellTypeVariants>['variant'];
</script>

<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { type }: { type: CellTypeVariant } = $props();
</script>

<Badge class={cellTypeVariants({ variant: type })} variant="outline">{type}</Badge>
