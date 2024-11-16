import { hash, verify } from "@node-rs/argon2";

// Use PBKDF2 for password hashing
export const saltAndHashPassword = async (password: string) => {
	return await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
};

export const verifyPassword = async (hash: string, password: string) => {
	return verify(hash, password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
};
