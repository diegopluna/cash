<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { checkForAppUpdates } from '../lib/updater';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();

	onMount(async () => {
		// Disable right click context menu
		// if (document) {
		// 	document.addEventListener('contextmenu', (e) => e.preventDefault());
		// }

		checkForAppUpdates(false);
	});
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<main>
			{@render children?.()}
		</main>
	</SidebarInset>
</SidebarProvider>
