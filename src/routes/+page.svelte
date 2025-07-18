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
	
	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
									Date & Time
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
									Location
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
									RSVPs
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
									Status
								</th>
								<th scope="col" class="relative px-6 py-3">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each data.games as game}
								<tr class="{game.userRSVP ? 'bg-blue-50' : ''}">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div class="font-medium">
											{formatDateTime(new Date(game.date), game.time)}
										</div>
										<div class="text-xs text-gray-500">{game.season.name}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{game.location}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<div class="flex space-x-2">
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
												{game.rsvpCounts.yes} Yes
											</span>
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
												{game.rsvpCounts.maybe} Maybe
											</span>
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
												{game.rsvpCounts.no} No
											</span>
										</div>
										{#if game.rsvpCounts.totalGuests > 0}
											<div class="text-xs text-gray-400 mt-1">+{game.rsvpCounts.totalGuests} guest{game.rsvpCounts.totalGuests > 1 ? 's' : ''}</div>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{#snippet statusBadge()}
											{@const totalPlayers = game.rsvpCounts.yes + game.rsvpCounts.totalGuests}
											{@const isConfirmed = totalPlayers >= 8}
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
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
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													You: {game.userRSVP}
												</span>
											{/if}
											<a href="/games/{game.id}" class="text-indigo-600 hover:text-indigo-900">
												{game.userRSVP ? 'Update' : 'RSVP'}
											</a>
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
										No upcoming games scheduled.
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
