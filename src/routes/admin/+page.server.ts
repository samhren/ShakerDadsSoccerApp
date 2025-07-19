import { error, fail, redirect } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { generateId } from 'lucia';
import { createDB } from '$lib/server/db';
import { game, season, rsvp, user } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = createDB(platform!.env.DB);
	if (!locals.user) {
		redirect(302, '/login');
	}

	if (!locals.user.isAdmin) {
		throw error(403, 'Access denied');
	}

	const seasons = await db
		.select()
		.from(season)
		.orderBy(desc(season.createdAt));

	const games = await db
		.select({
			id: game.id,
			date: game.date,
			time: game.time,
			location: game.location,
			comments: game.comments,
			emailSent: game.emailSent,
			season: {
				id: season.id,
				name: season.name
			}
		})
		.from(game)
		.innerJoin(season, eq(game.seasonId, season.id))
		.orderBy(desc(game.date));

	return {
		seasons,
		games
	};
};

export const actions: Actions = {
	createSeason: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const startDate = new Date(formData.get('startDate') as string);
		const endDate = new Date(formData.get('endDate') as string);

		if (!name || !startDate || !endDate) {
			return fail(400, { error: 'All fields are required' });
		}

		await db.insert(season).values({
			id: generateId(15),
			name,
			startDate,
			endDate,
			isActive: true
		});

		return { success: true };
	},

	createGame: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const seasonId = formData.get('seasonId') as string;
		const date = new Date(formData.get('date') as string);
		const time = formData.get('time') as string;
		const location = formData.get('location') as string;
		const comments = formData.get('comments') as string;

		if (!seasonId || !date || !time || !location) {
			return fail(400, { error: 'Season, date, time, and location are required' });
		}

		await db.insert(game).values({
			id: generateId(15),
			seasonId,
			date,
			time,
			location,
			comments,
			emailSent: false
		});

		return { success: true };
	},

	updateGame: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const gameId = formData.get('gameId') as string;
		const seasonId = formData.get('seasonId') as string;
		const date = new Date(formData.get('date') as string);
		const time = formData.get('time') as string;
		const location = formData.get('location') as string;
		const comments = formData.get('comments') as string;

		if (!gameId || !seasonId || !date || !time || !location) {
			return fail(400, { error: 'All fields are required' });
		}

		await db
			.update(game)
			.set({
				seasonId,
				date,
				time,
				location,
				comments
			})
			.where(eq(game.id, gameId));

		return { success: true };
	},

	deleteGame: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const gameId = formData.get('gameId') as string;

		if (!gameId) {
			return fail(400, { error: 'Game ID is required' });
		}

		// Delete RSVPs first
		await db.delete(rsvp).where(eq(rsvp.gameId, gameId));
		
		// Delete the game
		await db.delete(game).where(eq(game.id, gameId));

		return { success: true };
	},

	duplicateGame: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const gameId = formData.get('gameId') as string;
		const newDate = new Date(formData.get('newDate') as string);

		if (!gameId || !newDate) {
			return fail(400, { error: 'Game ID and new date are required' });
		}

		const [originalGame] = await db
			.select()
			.from(game)
			.where(eq(game.id, gameId));

		if (!originalGame) {
			return fail(400, { error: 'Game not found' });
		}

		await db.insert(game).values({
			id: generateId(15),
			seasonId: originalGame.seasonId,
			date: newDate,
			time: originalGame.time,
			location: originalGame.location,
			comments: originalGame.comments,
			emailSent: false
		});

		return { success: true };
	},

	updateSeason: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const seasonId = formData.get('seasonId') as string;
		const name = formData.get('name') as string;
		const startDate = new Date(formData.get('startDate') as string);
		const endDate = new Date(formData.get('endDate') as string);
		const isActive = formData.get('isActive') === 'on';

		if (!seasonId || !name || !startDate || !endDate) {
			return fail(400, { error: 'All fields are required' });
		}

		await db
			.update(season)
			.set({
				name,
				startDate,
				endDate,
				isActive
			})
			.where(eq(season.id, seasonId));

		return { success: true };
	},

	deleteSeason: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const seasonId = formData.get('seasonId') as string;

		if (!seasonId) {
			return fail(400, { error: 'Season ID is required' });
		}

		// Check if season has games
		const gamesInSeason = await db
			.select()
			.from(game)
			.where(eq(game.seasonId, seasonId));

		if (gamesInSeason.length > 0) {
			return fail(400, { error: 'Cannot delete season with existing games' });
		}

		await db.delete(season).where(eq(season.id, seasonId));

		return { success: true };
	},

	duplicateSeason: async ({ request, locals, platform }) => {
		const db = createDB(platform!.env.DB);
		if (!locals.user?.isAdmin) {
			throw error(403, 'Access denied');
		}

		const formData = await request.formData();
		const seasonId = formData.get('seasonId') as string;
		const newName = formData.get('newName') as string;

		if (!seasonId || !newName) {
			return fail(400, { error: 'Season ID and new name are required' });
		}

		const [originalSeason] = await db
			.select()
			.from(season)
			.where(eq(season.id, seasonId));

		if (!originalSeason) {
			return fail(400, { error: 'Season not found' });
		}

		await db.insert(season).values({
			id: generateId(15),
			name: newName,
			startDate: originalSeason.startDate,
			endDate: originalSeason.endDate,
			isActive: true
		});

		return { success: true };
	}
};