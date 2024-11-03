import { Argon2id } from "oslo/password";
// Use PBKDF2 for password hashing
export const saltAndHashPassword = async (password: string) => {
	const argon2id = new Argon2id();
	const hash = await argon2id.hash(password);
	return hash;
};

export const verifyPassword = async (hash: string, password: string) => {
	const argon2id = new Argon2id();
	return argon2id.verify(hash, password);
};
