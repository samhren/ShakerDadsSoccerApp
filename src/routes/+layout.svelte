<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { theme } from '$lib/stores/theme';

	let { children, data } = $props();

	function toggleTheme() {
		theme.toggle();
	}
</script>

{#if data.user}
	<nav class="bg-white dark:bg-gray-800 shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Shaker Soccer</a>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-gray-700 dark:text-gray-200">Welcome, {data.user.name}</span>
					<button
						type="button"
						class="text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
						onclick={toggleTheme}
					>
						{#if $theme === 'light'}
							🌙
						{:else}
							☀️
						{/if}
					</button>
					<a href="/profile" class="text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">Profile</a>
					{#if data.user.isAdmin}
						<a href="/admin" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Admin</a>
					{/if}
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Logout</button>
					</form>
				</div>
			</div>
		</div>
	</nav>
{/if}

<main class="min-h-screen bg-white dark:bg-gray-900">
	{@render children()}
</main>
