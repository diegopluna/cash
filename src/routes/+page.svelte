<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { categoriesCollection } from '$lib/tanstack/db/categories-collection';
	import { useLiveQuery } from '@tanstack/svelte-db';
	import { Sparkles } from 'lucide-svelte';

	const query = useLiveQuery((q) => q.from({ categories: categoriesCollection }));
</script>

<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
	<div class="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
		<header class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
				<p class="mt-1 text-muted-foreground">Welcome back to your financial overview.</p>
			</div>

			<div class="flex items-center gap-3">
				<Button
					variant="outline"
					class="hidden border-border/60 bg-background/50 backdrop-blur-sm sm:flex"
				>
					Manage Widgets
				</Button>
				<Button class="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
					<Sparkles className="h-4 w-4 mr-2" />
					AI Assistant
				</Button>
			</div>
			<div>
				<ul>
					{#each query.data as category (category.id)}
						<li>{category.name}</li>
					{/each}
				</ul>
			</div>
		</header>
	</div>
</div>
