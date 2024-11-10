import { db } from "@/db";
import type { UserRole } from "@/db/schema";
import { verifyPassword } from "@/utils/password";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";

export type AuthUser = {
	email: string;
	id: string;
	name: string;
	image: string | null;
	role: UserRole;
};

export default {
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
					const { email, password } = await signInSchema.parseAsync(credentials);

					// logic to verify if the user exists
					const dbuser = await db.query.users.findFirst({
						where: (users, { eq }) => eq(users.email, email),
					});
					if (!dbuser) return null;

					const isPasswordValid = await verifyPassword(dbuser.passwordHash, password);
					if (!isPasswordValid) return null;

					// return JSON object with the user data

					return {
						email: dbuser.email,
						id: dbuser.id,
						name: dbuser.name,
						image: dbuser.image ?? null,
						role: dbuser.role,
					};
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
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub,
			},
		}),
	},
} satisfies NextAuthConfig;
