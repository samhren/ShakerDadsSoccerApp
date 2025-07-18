<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
				Game Details
			</h3>
			<p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
				{data.game.season.name}
			</p>
		</div>
		<div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
			<dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
				<div>
					<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
					<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{new Date(data.game.date).toLocaleDateString()}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
					<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.game.time}</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
					<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.game.location}</dd>
				</div>
				{#if data.game.comments}
					<div class="sm:col-span-2">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{data.game.comments}</dd>
					</div>
				{/if}
				{#if data.weather}
					<div class="sm:col-span-2">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Weather Forecast</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
							<div class="flex items-center space-x-4">
								<div class="flex items-center">
									<img 
										src="https://openweathermap.org/img/wn/{data.weather.icon}@2x.png" 
										alt="{data.weather.description}"
										class="w-12 h-12"
									/>
									<div>
										<div class="font-medium">{data.weather.temperature}°F</div>
										<div class="text-xs text-gray-500 capitalize">{data.weather.description}</div>
									</div>
								</div>
								<div class="text-xs text-gray-500">
									<div>Humidity: {data.weather.humidity}%</div>
									<div>Wind: {data.weather.windSpeed} mph</div>
								</div>
							</div>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
	</div>

	<div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
				Your RSVP
			</h3>
		</div>
		<div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
			<form method="POST" use:enhance>
				<div class="space-y-6">
					<div>
						<label class="text-base font-medium text-gray-900 dark:text-white">Response</label>
						<fieldset class="mt-4">
							<div class="space-y-4">
								<div class="flex items-center">
									<input
										id="yes"
										name="response"
										type="radio"
										value="yes"
										checked={data.userRSVP?.response === 'yes'}
										class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
									/>
									<label for="yes" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Yes, I'll be there
									</label>
								</div>
								<div class="flex items-center">
									<input
										id="maybe"
										name="response"
										type="radio"
										value="maybe"
										checked={data.userRSVP?.response === 'maybe'}
										class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
									/>
									<label for="maybe" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Maybe
									</label>
								</div>
								<div class="flex items-center">
									<input
										id="no"
										name="response"
										type="radio"
										value="no"
										checked={data.userRSVP?.response === 'no'}
										class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
									/>
									<label for="no" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
										No, I can't make it
									</label>
								</div>
							</div>
						</fieldset>
					</div>

					<div>
						<label for="plusGuests" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Plus guests
						</label>
						<select
							id="plusGuests"
							name="plusGuests"
							class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						>
							<option value="0" selected={data.userRSVP?.plusGuests === 0}>0</option>
							<option value="1" selected={data.userRSVP?.plusGuests === 1}>1</option>
							<option value="2" selected={data.userRSVP?.plusGuests === 2}>2</option>
							<option value="3" selected={data.userRSVP?.plusGuests === 3}>3</option>
						</select>
					</div>

					<div>
						<label for="comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Comments
						</label>
						<textarea
							id="comments"
							name="comments"
							rows="3"
							class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Any additional comments..."
							value={data.userRSVP?.comments || ''}
						></textarea>
					</div>

					{#if form?.error}
						<div class="text-red-600 text-sm">{form.error}</div>
					{/if}

					{#if form?.success}
						<div class="text-green-600 text-sm">RSVP updated successfully!</div>
					{/if}

					<div>
						<button
							type="submit"
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Update RSVP
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>

	<div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-lg leading-6 font-medium text-gray-900">
				All RSVPs ({data.allRSVPs.length})
			</h3>
		</div>
		<div class="border-t border-gray-200">
			<ul class="divide-y divide-gray-200">
				{#each data.allRSVPs as rsvp}
					<li class="px-4 py-4 sm:px-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
										{rsvp.response === 'yes' ? 'bg-green-100 text-green-800' : 
										 rsvp.response === 'maybe' ? 'bg-yellow-100 text-yellow-800' : 
										 'bg-red-100 text-red-800'}">
										{rsvp.response}
									</span>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">{rsvp.user.name}</div>
									{#if rsvp.plusGuests > 0}
										<div class="text-sm text-gray-500">+{rsvp.plusGuests} guest{rsvp.plusGuests > 1 ? 's' : ''}</div>
									{/if}
								</div>
							</div>
							{#if rsvp.comments}
								<div class="text-sm text-gray-500 italic">"{rsvp.comments}"</div>
							{/if}
						</div>
					</li>
				{:else}
					<li class="px-4 py-4 sm:px-6">
						<div class="text-center text-sm text-gray-500">
							No RSVPs yet
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>