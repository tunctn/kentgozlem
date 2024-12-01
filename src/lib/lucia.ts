import { pool } from "@/db";
import type { AuthUser, User } from "@/db/schema";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { Google } from "arctic";
import { Lucia } from "lucia";
import { COOKIES } from "./cookies";
import { NODE_ENV, env } from "./env";

// Fix for https://github.com/lucia-auth/lucia/issues/1424
class CustomNodePostgresAdapter extends NodePostgresAdapter {
	override async getSessionAndUser(
		sessionId: string,
	): ReturnType<(typeof NodePostgresAdapter)["prototype"]["getSessionAndUser"]> {
		const [session, user] = await super.getSessionAndUser(sessionId);
		if (session) {
			session.expiresAt = new Date(session.expiresAt);
		}
		return [session, user];
	}
}

const adapter = new CustomNodePostgresAdapter(pool, {
	user: "users",
	session: "user_sessions",
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: COOKIES.AUTH_COOKIE,
		attributes: {
			secure: NODE_ENV === "production",
			domain: env.NEXT_PUBLIC_APP_DOMAIN,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			google_id: attributes.google_id,
			name: attributes.name,
			email_address: attributes.email_address,
			role: attributes.role,
			avatar_url: attributes.avatar_url,
		} satisfies AuthUser;
	},
});

export const googleOauth = new Google(
	env.GOOGLE_OAUTH_CLIENT_ID,
	env.GOOGLE_OAUTH_CLIENT_SECRET,
	`${env.NEXT_PUBLIC_API_ENDPOINT}/auth/oauth/google/callback`,
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}
