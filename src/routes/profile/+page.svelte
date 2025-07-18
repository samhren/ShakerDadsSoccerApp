<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="space-y-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
			<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
				Update your personal information and account settings.
			</p>
		</div>

		<!-- Profile Information -->
		<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
					Personal Information
				</h3>
				<p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
					Update your name and email address.
				</p>
			</div>
			<div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
				<form method="POST" action="?/updateProfile" use:enhance>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Full Name
							</label>
							<input
								type="text"
								name="name"
								id="name"
								value={data.user.name}
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Email Address
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={data.user.email}
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					{#if form?.error}
						<div class="mt-4 text-red-600 text-sm">{form.error}</div>
					{/if}

					{#if form?.success}
						<div class="mt-4 text-green-600 text-sm">Profile updated successfully!</div>
					{/if}

					<div class="mt-6">
						<button
							type="submit"
							class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Change Password -->
		<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
					Change Password
				</h3>
				<p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
					Update your password to keep your account secure.
				</p>
			</div>
			<div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
				<form method="POST" action="?/changePassword" use:enhance>
					<div class="space-y-6">
						<div>
							<label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Current Password
							</label>
							<input
								type="password"
								name="currentPassword"
								id="currentPassword"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								New Password
							</label>
							<input
								type="password"
								name="newPassword"
								id="newPassword"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Confirm New Password
							</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								required
								class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					{#if form?.passwordSuccess}
						<div class="mt-4 text-green-600 text-sm">Password changed successfully!</div>
					{/if}

					<div class="mt-6">
						<button
							type="submit"
							class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Change Password
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Account Information -->
		<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
					Account Information
				</h3>
			</div>
			<div class="border-t border-gray-200 dark:border-gray-700">
				<dl>
					<div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
							{#if data.user.isAdmin}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
									Administrator
								</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Player
								</span>
							{/if}
						</dd>
					</div>
					<div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
							{new Date(data.user.createdAt).toLocaleDateString()}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</div>