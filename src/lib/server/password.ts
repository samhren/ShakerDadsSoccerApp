import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
	return await argon2.hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		hashLength: 32,
		parallelism: 1
	});
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	return await argon2.verify(hash, password);
}