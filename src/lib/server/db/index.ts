import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// This function creates a database instance from a D1 binding
export function createDB(d1Database: D1Database) {
	return drizzle(d1Database, { schema });
}

// This will be set by the SvelteKit adapter
export type Database = ReturnType<typeof createDB>;
