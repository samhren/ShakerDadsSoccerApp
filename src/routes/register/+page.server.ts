import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/password';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!name || !email || !password) {
			return fail(400, { error: 'Name, email, and password are required' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		const [existingUser] = await db
			.select()
			.from(user)
			.where(eq(user.email, email));

		if (existingUser) {
			return fail(400, { error: 'Email already registered' });
		}

		const passwordHash = await hashPassword(password);
		const userId = generateId(15);

		await db.insert(user).values({
			id: userId,
			name,
			email,
			passwordHash,
			isAdmin: false
		});

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, userId);
		setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		redirect(302, '/');
	}
};