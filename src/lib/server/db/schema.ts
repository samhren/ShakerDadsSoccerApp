import { sqliteTable, integer, text, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: integer('is_admin', { mode: 'boolean' }).default(false).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const season = sqliteTable('season', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
	isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
});

export const game = sqliteTable('game', {
	id: text('id').primaryKey(),
	seasonId: text('season_id')
		.notNull()
		.references(() => season.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	time: text('time').notNull(),
	location: text('location').notNull(),
	comments: text('comments'),
	emailSent: integer('email_sent', { mode: 'boolean' }).default(false).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
});

export const rsvp = sqliteTable('rsvp', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	gameId: text('game_id')
		.notNull()
		.references(() => game.id),
	response: text('response').notNull(), // 'yes', 'no', 'maybe'
	plusGuests: integer('plus_guests').default(0).notNull(),
	comments: text('comments'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
});

export const guest = sqliteTable('guest', {
	id: text('id').primaryKey(),
	rsvpId: text('rsvp_id')
		.notNull()
		.references(() => rsvp.id),
	name: text('name').notNull(),
	response: text('response').notNull(), // 'yes', 'no', 'maybe'
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Season = typeof season.$inferSelect;
export type Game = typeof game.$inferSelect;
export type RSVP = typeof rsvp.$inferSelect;
export type Guest = typeof guest.$inferSelect;
