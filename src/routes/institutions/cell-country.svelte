<script lang="ts">
	import { countryCodeToFlag } from '$lib/utils';
	import countries from '$lib/countries';

	let { code }: { code: string } = $props();

	const country = $derived(countries.find((c) => c.code === code));
	const flag = $derived(countryCodeToFlag(code));
</script>

<div class="flex items-center gap-1.5">
	<span class="text-base">{flag}</span>
	<span class="text-muted-foreground">{country?.name ?? code}</span>
</div>
