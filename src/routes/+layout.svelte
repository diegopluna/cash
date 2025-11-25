<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { checkForAppUpdates } from '../lib/updater';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/tanstack/query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { initStore } from '$lib/stores/init';
	import { seed } from '$lib/db/seed';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	onMount(async () => {
		// Disable right click context menu
		if (import.meta.env.PROD) {
			if (document) {
				document.addEventListener('contextmenu', (e) => e.preventDefault());
			}

			checkForAppUpdates(false);
		}

		// Start store
		await initStore.start();

		const seeded = initStore.state.seeded;
		if (!seeded) {
			await seed();
			initStore.state.seeded = true;
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
	<Toaster />
</QueryClientProvider>
