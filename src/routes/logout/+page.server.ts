import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import { createDB } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals, cookies, platform }) => {
		if (locals.session) {
			const db = createDB(platform!.env.DB);
			await invalidateSession(locals.session.id, db);
			deleteSessionTokenCookie({ cookies } as any);
		}
		redirect(302, '/login');
	}
};