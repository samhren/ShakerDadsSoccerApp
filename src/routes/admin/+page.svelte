<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let showSeasonForm = false;
	let showGameForm = false;
	let editingGame: any = null;
	let duplicatingGame: any = null;
	let editingSeason: any = null;
	let duplicatingSeason: any = null;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Admin Panel</h1>
			<p class="mt-2 text-sm text-gray-700">
				Manage seasons and games for the soccer pickup app.
			</p>
		</div>
	</div>

	<!-- Seasons Section -->
	<div class="mt-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h2 class="text-lg font-medium text-gray-900">Seasons</h2>
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					onclick={() => showSeasonForm = !showSeasonForm}
				>
					Add Season
				</button>
			</div>
		</div>

		{#if showSeasonForm || editingSeason}
			<div class="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
				<form method="POST" action="?/{editingSeason ? 'updateSeason' : 'createSeason'}" use:enhance>
					{#if editingSeason}
						<input type="hidden" name="seasonId" value={editingSeason.id} />
					{/if}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Season Name</label>
							<input
								type="text"
								name="name"
								id="name"
								required
								value={editingSeason ? editingSeason.name : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="e.g., Summer 2025"
							/>
						</div>
						<div>
							<label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
							<input
								type="date"
								name="startDate"
								id="startDate"
								required
								value={editingSeason ? editingSeason.startDate.toISOString().split('T')[0] : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
							<input
								type="date"
								name="endDate"
								id="endDate"
								required
								value={editingSeason ? editingSeason.endDate.toISOString().split('T')[0] : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					{#if editingSeason}
						<div class="mt-4">
							<label class="flex items-center">
								<input
									type="checkbox"
									name="isActive"
									checked={editingSeason.isActive}
									class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active Season</span>
							</label>
						</div>
					{/if}
					<div class="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onclick={() => {
								showSeasonForm = false;
								editingSeason = null;
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{editingSeason ? 'Update Season' : 'Create Season'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if duplicatingSeason}
			<div class="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">Duplicate Season</h4>
				<form method="POST" action="?/duplicateSeason" use:enhance>
					<input type="hidden" name="seasonId" value={duplicatingSeason.id} />
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="newName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Season Name</label>
							<input
								type="text"
								name="newName"
								id="newName"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="e.g., Fall 2025"
							/>
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">
							<p><strong>Original:</strong> {duplicatingSeason.name}</p>
							<p><strong>Start:</strong> {duplicatingSeason.startDate.toLocaleDateString()}</p>
							<p><strong>End:</strong> {duplicatingSeason.endDate.toLocaleDateString()}</p>
						</div>
					</div>
					<div class="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onclick={() => duplicatingSeason = null}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="bg-yellow-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
						>
							Duplicate Season
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
			<table class="min-w-full divide-y divide-gray-300">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">End Date</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.seasons as season}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{season.name}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(season.startDate).toLocaleDateString()}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(season.endDate).toLocaleDateString()}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {season.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{season.isActive ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<div class="flex space-x-2">
									<button
										type="button"
										class="text-blue-600 hover:text-blue-900"
										onclick={() => editingSeason = season}
									>
										Edit
									</button>
									<button
										type="button"
										class="text-yellow-600 hover:text-yellow-900"
										onclick={() => duplicatingSeason = season}
									>
										Duplicate
									</button>
									<form method="POST" action="?/deleteSeason" use:enhance class="inline">
										<input type="hidden" name="seasonId" value={season.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											onclick={(e) => {
												if (!confirm('Are you sure you want to delete this season? This action cannot be undone.')) {
													e.preventDefault();
												}
											}}
										>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No seasons created yet.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Games Section -->
	<div class="mt-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h2 class="text-lg font-medium text-gray-900">Games</h2>
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					onclick={() => showGameForm = !showGameForm}
				>
					Add Game
				</button>
			</div>
		</div>

		{#if showGameForm || editingGame}
			<div class="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
				<form method="POST" action="?/{editingGame ? 'updateGame' : 'createGame'}" use:enhance>
					{#if editingGame}
						<input type="hidden" name="gameId" value={editingGame.id} />
					{/if}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="seasonId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Season</label>
							<select
								name="seasonId"
								id="seasonId"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value="">Select a season</option>
								{#each data.seasons.filter(s => s.isActive) as season}
									<option value={season.id} selected={editingGame && editingGame.season.id === season.id}>{season.name}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
							<input
								type="date"
								name="date"
								id="date"
								required
								value={editingGame ? editingGame.date.toISOString().split('T')[0] : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
							<input
								type="time"
								name="time"
								id="time"
								required
								value={editingGame ? editingGame.time : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
							<input
								type="text"
								name="location"
								id="location"
								required
								value={editingGame ? editingGame.location : ''}
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="e.g., Shaker Heights Middle School"
							/>
						</div>
						<div class="sm:col-span-2">
							<label for="comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Comments</label>
							<textarea
								name="comments"
								id="comments"
								rows="3"
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Additional game information..."
								value={editingGame ? editingGame.comments || '' : ''}
							></textarea>
						</div>
					</div>
					<div class="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onclick={() => {
								showGameForm = false;
								editingGame = null;
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{editingGame ? 'Update Game' : 'Create Game'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if duplicatingGame}
			<div class="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">Duplicate Game</h4>
				<form method="POST" action="?/duplicateGame" use:enhance>
					<input type="hidden" name="gameId" value={duplicatingGame.id} />
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="newDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Date</label>
							<input
								type="date"
								name="newDate"
								id="newDate"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-300">
							<p><strong>Original:</strong> {duplicatingGame.location}</p>
							<p><strong>Time:</strong> {duplicatingGame.time}</p>
							<p><strong>Season:</strong> {duplicatingGame.season.name}</p>
						</div>
					</div>
					<div class="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onclick={() => duplicatingGame = null}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="bg-yellow-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
						>
							Duplicate Game
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
			<table class="min-w-full divide-y divide-gray-300">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Time</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Location</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Season</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email Sent</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.games as game}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{new Date(game.date).toLocaleDateString()} at {game.time}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.location}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.season.name}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {game.emailSent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{game.emailSent ? 'Yes' : 'No'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<div class="flex space-x-2">
									<a href="/games/{game.id}" class="text-indigo-600 hover:text-indigo-900">View</a>
									<button
										type="button"
										class="text-blue-600 hover:text-blue-900"
										onclick={() => editingGame = game}
									>
										Edit
									</button>
									<button
										type="button"
										class="text-yellow-600 hover:text-yellow-900"
										onclick={() => duplicatingGame = game}
									>
										Duplicate
									</button>
									<form method="POST" action="?/deleteGame" use:enhance class="inline">
										<input type="hidden" name="gameId" value={game.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											onclick={(e) => {
												if (!confirm('Are you sure you want to delete this game? This will also delete all RSVPs.')) {
													e.preventDefault();
												}
											}}
										>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No games created yet.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if form?.success}
		<div class="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
			<div class="text-sm text-green-800">Operation completed successfully!</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
			<div class="text-sm text-red-800">{form.error}</div>
		</div>
	{/if}
</div>