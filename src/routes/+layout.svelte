<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { checkForAppUpdates } from '../lib/updater';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/tanstack/query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children } = $props();

	onMount(async () => {
		// Disable right click context menu
		if (import.meta.env.PROD) {
			if (document) {
				document.addEventListener('contextmenu', (e) => e.preventDefault());
			}

			checkForAppUpdates(false);
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<SidebarProvider>
		<AppSidebar />
		<SidebarInset>
			<main>
				{@render children?.()}
			</main>
		</SidebarInset>
	</SidebarProvider>
	<SvelteQueryDevtools buttonPosition="bottom-right" />
</QueryClientProvider>
