import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/password';
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
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const [existingUser] = await db
			.select()
			.from(user)
			.where(eq(user.email, email));

		if (!existingUser) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		redirect(302, '/');
	}
};