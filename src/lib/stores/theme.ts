import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	// Initialize with the actual theme if in browser
	let initialTheme: Theme = 'light';
	if (browser) {
		const stored = localStorage.getItem('theme') as Theme;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		initialTheme = stored || (prefersDark ? 'dark' : 'light');
		
		// Apply theme immediately
		document.documentElement.classList.remove('dark', 'light');
		document.documentElement.classList.add(initialTheme);
	}

	const { subscribe, set, update } = writable<Theme>(initialTheme);

	return {
		subscribe,
		toggle: () => update((theme) => {
			const newTheme = theme === 'light' ? 'dark' : 'light';
			if (browser) {
				localStorage.setItem('theme', newTheme);
				// Remove existing class and add new one
				document.documentElement.classList.remove('dark', 'light');
				document.documentElement.classList.add(newTheme);
			}
			return newTheme;
		}),
		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme') as Theme;
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const theme = stored || (prefersDark ? 'dark' : 'light');
				
				// Remove existing classes and add the correct one
				document.documentElement.classList.remove('dark', 'light');
				document.documentElement.classList.add(theme);
				set(theme);
			}
		}
	};
}

export const theme = createThemeStore();