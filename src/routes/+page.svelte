<script lang="ts">
	import { formatDateTime } from '$lib/utils/date';
	
	export let data;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Upcoming Games</h1>
			<p class="mt-2 text-sm text-gray-700">
				RSVP for pickup soccer games in your area.
			</p>
		</div>
	</div>

	<!-- Game Reminders Section -->
	{#if data.userRSVPs.length > 0}
		<div class="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-blue-800">
						You have {data.userRSVPs.length} upcoming game{data.userRSVPs.length > 1 ? 's' : ''} you've RSVP'd to
					</h3>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Desktop Table View -->
	<div class="mt-8 hidden md:block">
		<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
			<table class="min-w-full divide-y divide-gray-300">
				<thead class="bg-gray-50 dark:bg-gray-800">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							Date & Time
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							Location
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							RSVPs
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							Status
						</th>
						<th scope="col" class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
					{#each data.games as game}
						<tr class="{game.userRSVP ? 'bg-blue-50 dark:bg-blue-900/20' : ''}">
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
								<div class="font-medium">
									{formatDateTime(new Date(game.date), game.time)}
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{game.season.name}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
								{game.location}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								<div class="flex flex-wrap gap-1">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
										{game.rsvpCounts.yes + game.rsvpCounts.guestYes} Yes
										{#if game.rsvpCounts.guestYes > 0}
											<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.yes} {game.rsvpCounts.yes === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestYes} {game.rsvpCounts.guestYes === 1 ? 'guest' : 'guests'})</span>
										{/if}
									</span>
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
										{game.rsvpCounts.maybe + game.rsvpCounts.guestMaybe} Maybe
										{#if game.rsvpCounts.guestMaybe > 0}
											<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.maybe} {game.rsvpCounts.maybe === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestMaybe} {game.rsvpCounts.guestMaybe === 1 ? 'guest' : 'guests'})</span>
										{/if}
									</span>
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
										{game.rsvpCounts.no + game.rsvpCounts.guestNo} No
										{#if game.rsvpCounts.guestNo > 0}
											<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.no} {game.rsvpCounts.no === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestNo} {game.rsvpCounts.guestNo === 1 ? 'guest' : 'guests'})</span>
										{/if}
									</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								{#snippet statusBadge()}
									{@const totalPlayers = game.rsvpCounts.yes + game.rsvpCounts.guestYes}
									{@const isConfirmed = totalPlayers >= 8}
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {isConfirmed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}">
										{#if isConfirmed}
											✓ Confirmed ({totalPlayers} players)
										{:else}
											⚠ Need {8 - totalPlayers} more
										{/if}
									</span>
								{/snippet}
								{@render statusBadge()}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div class="flex justify-end space-x-2">
									{#if game.userRSVP}
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
											You: {game.userRSVP}
										</span>
									{/if}
									<a href="/games/{game.id}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
										{game.userRSVP ? 'Update' : 'RSVP'}
									</a>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
								No upcoming games scheduled.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Mobile Card View -->
	<div class="mt-8 md:hidden space-y-4">
		{#each data.games as game}
			<div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden {game.userRSVP ? 'ring-2 ring-blue-500' : ''}">
				<div class="px-4 py-5 sm:p-6">
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
								{formatDateTime(new Date(game.date), game.time)}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">{game.season.name}</p>
						</div>
						{#if game.userRSVP}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
								Your RSVP: {game.userRSVP}
							</span>
						{/if}
					</div>

					<div class="mb-4">
						<p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Location</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">{game.location}</p>
					</div>

					<div class="mb-4">
						<p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">RSVPs</p>
						<div class="flex flex-wrap gap-2">
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
								{game.rsvpCounts.yes + game.rsvpCounts.guestYes} Yes
								{#if game.rsvpCounts.guestYes > 0}
									<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.yes} {game.rsvpCounts.yes === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestYes} {game.rsvpCounts.guestYes === 1 ? 'guest' : 'guests'})</span>
								{/if}
							</span>
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
								{game.rsvpCounts.maybe + game.rsvpCounts.guestMaybe} Maybe
								{#if game.rsvpCounts.guestMaybe > 0}
									<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.maybe} {game.rsvpCounts.maybe === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestMaybe} {game.rsvpCounts.guestMaybe === 1 ? 'guest' : 'guests'})</span>
								{/if}
							</span>
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
								{game.rsvpCounts.no + game.rsvpCounts.guestNo} No
								{#if game.rsvpCounts.guestNo > 0}
									<span class="ml-1 text-xs opacity-75">({game.rsvpCounts.no} {game.rsvpCounts.no === 1 ? 'player' : 'players'} + {game.rsvpCounts.guestNo} {game.rsvpCounts.guestNo === 1 ? 'guest' : 'guests'})</span>
								{/if}
							</span>
						</div>
					</div>

					<div class="flex justify-between items-center">
						<div>
							{#snippet statusBadge()}
								{@const totalPlayers = game.rsvpCounts.yes + game.rsvpCounts.guestYes}
								{@const isConfirmed = totalPlayers >= 8}
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {isConfirmed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}">
									{#if isConfirmed}
										✓ Confirmed ({totalPlayers} players)
									{:else}
										⚠ Need {8 - totalPlayers} more
									{/if}
								</span>
							{/snippet}
							{@render statusBadge()}
						</div>
						<a 
							href="/games/{game.id}" 
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{game.userRSVP ? 'Update RSVP' : 'RSVP Now'}
						</a>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
				<div class="px-4 py-5 sm:p-6 text-center">
					<p class="text-sm text-gray-500 dark:text-gray-400">No upcoming games scheduled.</p>
				</div>
			</div>
		{/each}
	</div>
</div>
