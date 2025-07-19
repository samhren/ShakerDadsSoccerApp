import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'lucia';
import { db } from '$lib/server/db';
import { game, season, rsvp, user, guest } from '$lib/server/db/schema';
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

	// Get user's guests if they have an RSVP
	let userGuests = [];
	if (existingRSVP.length) {
		userGuests = await db
			.select()
			.from(guest)
			.where(eq(guest.rsvpId, existingRSVP[0].id));
	}

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

	// Get all guests for all RSVPs
	const allGuests = await db
		.select({
			id: guest.id,
			rsvpId: guest.rsvpId,
			name: guest.name,
			response: guest.response
		})
		.from(guest)
		.innerJoin(rsvp, eq(guest.rsvpId, rsvp.id))
		.where(eq(rsvp.gameId, params.id));

	// Get weather data for the game
	const weather = await getWeatherForGame(gameData[0].location, gameData[0].date) || getMockWeatherData();

	return {
		game: gameData[0],
		userRSVP: existingRSVP[0] ? { ...existingRSVP[0], guests: userGuests } : null,
		allRSVPs: allRSVPs.map(rsvp => ({
			...rsvp,
			guests: allGuests.filter(g => g.rsvpId === rsvp.id)
		})),
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

		// Parse guest data from form
		const guests = [];
		for (let i = 0; i < plusGuests; i++) {
			const guestName = formData.get(`guest-${i}-name`) as string;
			const guestResponse = formData.get(`guest-${i}-response`) as string;
			
			if (guestName && guestResponse && ['yes', 'no', 'maybe'].includes(guestResponse)) {
				guests.push({
					name: guestName,
					response: guestResponse
				});
			}
		}

		const existingRSVP = await db
			.select()
			.from(rsvp)
			.where(and(eq(rsvp.gameId, params.id), eq(rsvp.userId, locals.user.id)));

		let rsvpId: string;

		if (existingRSVP.length) {
			// Update existing RSVP
			rsvpId = existingRSVP[0].id;
			await db
				.update(rsvp)
				.set({
					response,
					plusGuests,
					comments,
					updatedAt: new Date()
				})
				.where(eq(rsvp.id, rsvpId));

			// Delete existing guests
			await db.delete(guest).where(eq(guest.rsvpId, rsvpId));
		} else {
			// Create new RSVP
			rsvpId = generateId(15);
			await db.insert(rsvp).values({
				id: rsvpId,
				userId: locals.user.id,
				gameId: params.id,
				response,
				plusGuests,
				comments
			});
		}

		// Insert new guests
		if (guests.length > 0) {
			await db.insert(guest).values(
				guests.map(g => ({
					id: generateId(15),
					rsvpId,
					name: g.name,
					response: g.response
				}))
			);
		}

		return { success: true };
	}
};