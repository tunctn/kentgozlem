import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const nextauth = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	session: {
		strategy: "jwt",
	},
	...authConfig,
	pages: {
		signIn: "/auth/sign-in",
	},
});

export const { handlers, signIn, signOut, auth } = nextauth;
