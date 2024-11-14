import { db } from "@/db";
import { type UserRole, users } from "@/db/schema";
import { verifyPassword } from "@/utils/password";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { signInSchema } from "./zod";

export type AuthUser = {
	email: string;
	id: string;
	name: string;
	image: string | null;
	role: UserRole;
};

const Credentials = CredentialsProvider({
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
			if (!dbuser.passwordHash) return null;

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
});

export const providers: Provider[] = [Credentials, Google];

export default {
	providers,
	events: {},
	callbacks: {
		// signIn
		// authorized
		// redirect
		// jwt

		signIn: async ({ user, account, profile }) => {
			const userId = user.id;
			const cookieStore = await cookies();
			cookieStore.set("redirect", "/", { maxAge: 60 }); // Expires in 1 minute

			if (userId) {
				const dbUser = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.id, userId),
				});
				if (dbUser?.emailVerified) return true;

				if (account?.provider === "google") {
					if (profile?.email_verified) {
						await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, userId));
					}
				}
			}

			return true;
		},

		session: ({ session, token, user }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.sub,
				},
			};
		},
	},
} satisfies NextAuthConfig;
