import { pgTable, serial, integer, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').default(false).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const season = pgTable('season', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).notNull(),
	endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const game = pgTable('game', {
	id: text('id').primaryKey(),
	seasonId: text('season_id')
		.notNull()
		.references(() => season.id),
	date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
	time: text('time').notNull(),
	location: text('location').notNull(),
	comments: text('comments'),
	emailSent: boolean('email_sent').default(false).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const rsvp = pgTable('rsvp', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	gameId: text('game_id')
		.notNull()
		.references(() => game.id),
	response: varchar('response', { length: 10 }).notNull(), // 'yes', 'no', 'maybe'
	plusGuests: integer('plus_guests').default(0).notNull(),
	comments: text('comments'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Season = typeof season.$inferSelect;
export type Game = typeof game.$inferSelect;
export type RSVP = typeof rsvp.$inferSelect;
