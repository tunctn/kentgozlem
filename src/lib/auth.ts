import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { getUserFromDb } from "@/server/auth/get-user-from-db";
import { signInSchema } from "@/server/auth/sign-in";
import { saltAndHashPassword } from "@/utils/password";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				try {
					let user: User | null = null;

					const { email, password } = await signInSchema.parseAsync(credentials);

					// logic to salt and hash password
					const pwHash = await saltAndHashPassword(password);

					// logic to verify if the user exists
					user = await getUserFromDb(email, pwHash);
					if (!user) {
						throw new Error("Invalid credentials.");
					}

					// return JSON object with the user data
					return user;
				} catch (error) {
					if (error instanceof ZodError) {
						// Return `null` to indicate that the credentials are invalid
						return null;
					}

					throw error;
				}
			},
		}),
	],
});
