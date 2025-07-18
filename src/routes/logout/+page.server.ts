import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (locals.session) {
			await invalidateSession(locals.session.id);
			deleteSessionTokenCookie({ cookies } as any);
		}
		redirect(302, '/login');
	}
};