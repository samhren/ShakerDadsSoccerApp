import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { game, season, rsvp, user } from '$lib/server/db/schema';
import { eq, desc, sql, and, gte, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const games = await db
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
		.where(and(
			eq(season.isActive, true),
			gte(game.date, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Show games from yesterday onwards
		))
		.orderBy(game.date)
		.limit(20);

	// Get RSVP counts for each game
	const gameIds = games.map(g => g.id);
	const rsvpCounts = gameIds.length > 0 ? await db
		.select({
			gameId: rsvp.gameId,
			response: rsvp.response,
			totalGuests: sql<number>`sum(${rsvp.plusGuests})`.as('total_guests'),
			count: sql<number>`count(*)`.as('count')
		})
		.from(rsvp)
		.where(inArray(rsvp.gameId, gameIds))
		.groupBy(rsvp.gameId, rsvp.response) : [];

	// Get user's upcoming RSVPs
	const userRSVPs = gameIds.length > 0 ? await db
		.select({
			gameId: rsvp.gameId,
			response: rsvp.response
		})
		.from(rsvp)
		.where(and(
			eq(rsvp.userId, locals.user.id),
			inArray(rsvp.gameId, gameIds)
		)) : [];

	// Process RSVP counts by game
	const rsvpCountsByGame = rsvpCounts.reduce((acc, row) => {
		if (!acc[row.gameId]) {
			acc[row.gameId] = { yes: 0, maybe: 0, no: 0, totalGuests: 0 };
		}
		if (row.response === 'yes' || row.response === 'maybe' || row.response === 'no') {
			acc[row.gameId][row.response] = Number(row.count);
		}
		if (row.response === 'yes') {
			acc[row.gameId].totalGuests = Number(row.totalGuests || 0);
		}
		return acc;
	}, {} as Record<string, { yes: number; maybe: number; no: number; totalGuests: number }>);

	// Process user RSVPs
	const userRSVPsByGame = userRSVPs.reduce((acc, row) => {
		acc[row.gameId] = row.response;
		return acc;
	}, {} as Record<string, string>);

	return {
		games: games.map(game => ({
			...game,
			rsvpCounts: rsvpCountsByGame[game.id] || { yes: 0, maybe: 0, no: 0, totalGuests: 0 },
			userRSVP: userRSVPsByGame[game.id] || null
		})),
		userRSVPs: userRSVPs.filter(rsvp => rsvp.response === 'yes' || rsvp.response === 'maybe')
	};
};