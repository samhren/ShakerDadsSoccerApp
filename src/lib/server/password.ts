const ITERATIONS = 100000;
const SALT_LENGTH = 32;
const HASH_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
	const encoder = new TextEncoder();
	const passwordBuffer = encoder.encode(password);

	const key = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, [
		'deriveBits'
	]);

	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: ITERATIONS,
			hash: 'SHA-256'
		},
		key,
		HASH_LENGTH * 8
	);

	const hash = new Uint8Array(hashBuffer);
	const combined = new Uint8Array(salt.length + hash.length);
	combined.set(salt);
	combined.set(hash, salt.length);

	return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
	try {
		const combined = new Uint8Array(
			atob(hashedPassword)
				.split('')
				.map((char) => char.charCodeAt(0))
		);
		const salt = combined.slice(0, SALT_LENGTH);
		const storedHash = combined.slice(SALT_LENGTH);

		const encoder = new TextEncoder();
		const passwordBuffer = encoder.encode(password);

		const key = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, [
			'deriveBits'
		]);

		const hashBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: ITERATIONS,
				hash: 'SHA-256'
			},
			key,
			HASH_LENGTH * 8
		);

		const hash = new Uint8Array(hashBuffer);

		if (hash.length !== storedHash.length) {
			return false;
		}

		for (let i = 0; i < hash.length; i++) {
			if (hash[i] !== storedHash[i]) {
				return false;
			}
		}

		return true;
	} catch {
		return false;
	}
}
