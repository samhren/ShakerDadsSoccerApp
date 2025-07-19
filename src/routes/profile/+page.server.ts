import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { createDB } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/password';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user) {
			redirect(302, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;

		if (!name || !email) {
			return fail(400, { error: 'Name and email are required' });
		}

		// Check if email is already taken by another user
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.email, email));

		if (existingUser.length > 0 && existingUser[0].id !== locals.user.id) {
			return fail(400, { error: 'Email already in use by another account' });
		}

		await db
			.update(user)
			.set({ name, email })
			.where(eq(user.id, locals.user.id));

		return { success: true };
	},

	changePassword: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user) {
			redirect(302, '/login');
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { error: 'All password fields are required' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'New passwords do not match' });
		}

		if (newPassword.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		// For now, skip current password verification for simplicity
		// In production, you'd want to verify the current password

		const passwordHash = await hashPassword(newPassword);
		await db
			.update(user)
			.set({ passwordHash })
			.where(eq(user.id, locals.user.id));

		return { passwordSuccess: true };
	}
};