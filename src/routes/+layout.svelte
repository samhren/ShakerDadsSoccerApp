<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { theme } from '$lib/stores/theme';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);

	function toggleTheme() {
		theme.toggle();
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

{#if data.user}
	<nav class="bg-white dark:bg-gray-800 shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Shaker Soccer</a>
				</div>
				
				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center space-x-4">
					<span class="text-gray-700 dark:text-gray-200 hidden lg:inline">Welcome, {data.user.name}</span>
					<button
						type="button"
						class="p-2 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
						onclick={toggleTheme}
						aria-label="Toggle theme"
					>
						{#if $theme === 'light'}
							🌙
						{:else}
							☀️
						{/if}
					</button>
					<a href="/profile" class="px-3 py-2 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">Profile</a>
					{#if data.user.isAdmin}
						<a href="/admin" class="px-3 py-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Admin</a>
					{/if}
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Logout</button>
					</form>
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden flex items-center">
					<button
						type="button"
						class="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200"
						onclick={toggleMobileMenu}
						aria-label="Toggle mobile menu"
					>
						{#if mobileMenuOpen}
							<svg class="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg class="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu -->
		<div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out {mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
				<div class="px-3 py-2 text-gray-700 dark:text-gray-200 text-sm">Welcome, {data.user.name}</div>
				<button
					type="button"
					class="flex items-center w-full px-3 py-2 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-150"
					onclick={toggleTheme}
				>
					{#if $theme === 'light'}
						🌙 Dark Mode
					{:else}
						☀️ Light Mode
					{/if}
				</button>
				<a href="/profile" class="block px-3 py-2 text-gray-600 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-150">Profile</a>
				{#if data.user.isAdmin}
					<a href="/admin" class="block px-3 py-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-150">Admin</a>
				{/if}
				<form method="POST" action="/logout" use:enhance>
					<button type="submit" class="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150">Logout</button>
				</form>
			</div>
		</div>
	</nav>
{/if}

<main class="min-h-screen bg-white dark:bg-gray-900">
	{@render children()}
</main>
