<script lang="ts" module>
	export const cellBadgeVariants = tv({
		base: 'capitalize',
		variants: {
			variant: {
				bank: 'bg-slate-700/80 text-slate-200 border-slate-600',
				fintech: 'bg-teal-900/70 text-teal-300 border-teal-700',
				broker: 'bg-rose-900/70 text-rose-300 border-rose-700',
				digital_wallet: 'bg-amber-900/70 text-amber-300 border-amber-700',
				other: 'bg-zinc-700/80 text-zinc-300 border-zinc-600'
			}
		},
		defaultVariants: {
			variant: 'bank'
		}
	});

	export type CellBadgeVariant = VariantProps<typeof cellBadgeVariants>['variant'];
</script>

<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { Badge } from '../../lib/components/ui/badge';

	let { title, variant }: { title: string; variant: CellBadgeVariant } = $props();
</script>

<Badge class={cellBadgeVariants({ variant })} variant="outline">{title}</Badge>
