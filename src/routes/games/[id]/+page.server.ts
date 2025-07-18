import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'lucia';
import { db } from '$lib/server/db';
import { game, season, rsvp, user } from '$lib/server/db/schema';
import { getWeatherForGame, getMockWeatherData } from '$lib/server/weather';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const gameData = await db
		.select({
			id: game.id,
			date: game.date,
			time: game.time,
			location: game.location,
			comments: game.comments,
			season: {
				id: season.id,
				name: season.name
			}
		})
		.from(game)
		.innerJoin(season, eq(game.seasonId, season.id))
		.where(eq(game.id, params.id));

	if (!gameData.length) {
		throw error(404, 'Game not found');
	}

	const existingRSVP = await db
		.select()
		.from(rsvp)
		.where(and(eq(rsvp.gameId, params.id), eq(rsvp.userId, locals.user.id)));

	const allRSVPs = await db
		.select({
			id: rsvp.id,
			response: rsvp.response,
			plusGuests: rsvp.plusGuests,
			comments: rsvp.comments,
			user: {
				name: user.name
			}
		})
		.from(rsvp)
		.innerJoin(user, eq(rsvp.userId, user.id))
		.where(eq(rsvp.gameId, params.id));

	// Get weather data for the game
	const weather = await getWeatherForGame(gameData[0].location, gameData[0].date) || getMockWeatherData();

	return {
		game: gameData[0],
		userRSVP: existingRSVP[0] || null,
		allRSVPs,
		weather
	};
};

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		if (!locals.user) {
			redirect(302, '/login');
		}

		const formData = await request.formData();
		const response = formData.get('response') as string;
		const plusGuests = parseInt(formData.get('plusGuests') as string) || 0;
		const comments = formData.get('comments') as string;

		if (!response || !['yes', 'no', 'maybe'].includes(response)) {
			return fail(400, { error: 'Invalid response' });
		}

		const existingRSVP = await db
			.select()
			.from(rsvp)
			.where(and(eq(rsvp.gameId, params.id), eq(rsvp.userId, locals.user.id)));

		if (existingRSVP.length) {
			await db
				.update(rsvp)
				.set({
					response,
					plusGuests,
					comments,
					updatedAt: new Date()
				})
				.where(eq(rsvp.id, existingRSVP[0].id));
		} else {
			await db.insert(rsvp).values({
				id: generateId(15),
				userId: locals.user.id,
				gameId: params.id,
				response,
				plusGuests,
				comments
			});
		}

		return { success: true };
	}
};