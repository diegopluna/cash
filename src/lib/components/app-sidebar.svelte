<script lang="ts">
	import { House, Wallet, TrendingUp, ChartColumn, List } from 'lucide-svelte';
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarSeparator
	} from './ui/sidebar';
	import { page } from '$app/state';
	import { Settings } from 'lucide-svelte';

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: House },
		{ name: 'Transactions', href: '/transactions', icon: Wallet },
		{ name: 'Categories', href: '/categories', icon: List },
		{ name: 'Investments', href: '/investments', icon: TrendingUp },
		{ name: 'Reports', href: '/reports', icon: ChartColumn }
	];
</script>

<Sidebar>
	<SidebarHeader>
		<div class="flex items-center gap-3 px-2 py-2">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg"
			>
				<Wallet class="h-5 w-5 text-primary-foreground" />
			</div>
			<span class="text-lg font-bold tracking-tight">Cash</span>
		</div>
	</SidebarHeader>
	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each navigation as item}
						<SidebarMenuItem>
							<a href={item.href}>
								<SidebarMenuButton isActive={item.href === page.url.pathname}>
									<item.icon class="h-4 w-4" />
									<span>{item.name}</span>
								</SidebarMenuButton>
							</a>
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

	<SidebarFooter>
		<SidebarSeparator />
		<SidebarMenu>
			<SidebarMenuItem>
				<a href="/settings">
					<SidebarMenuButton isActive={page.url.pathname === '/settings'}>
						<Settings class="h-4 w-4" />
						<span>Settings</span>
					</SidebarMenuButton>
				</a>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
