import { db } from "@/db";
import { users } from "@/db/schema";
import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { googleOauth, lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { ApiError } from "@/lib/server/error-handler";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseCookies } from "oslo/cookie";
import { z } from "zod";

export const GET = apiRoute({
	query: z.object({
		code: z.string(),
		state: z.string(),
	}),
}).loose(async (req) => {
	const cookieStore = await cookies();

	const code = req.query.code?.toString() ?? null;
	const state = req.query.state?.toString() ?? null;

	const getCookie = (cookieString: string) => {
		return parseCookies(cookieStore.get(cookieString)?.value ?? "").get(cookieString) ?? null;
	};

	const storedState = getCookie(COOKIES.GOOGLE_OAUTH_STATE);
	const storedCodeVerifier = getCookie(COOKIES.GOOGLE_OAUTH_CODE_VERIFIER);

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const redirectUrl = getCookie(COOKIES.AUTH_REDIRECT);
	if (!redirectUrl) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	try {
		const tokens = await googleOauth.validateAuthorizationCode(code, storedCodeVerifier);
		const accessToken = tokens.accessToken();

		const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const user = await googleUserResponse.json();
		const googleUser = user as GoogleUser;

		const existingUserRows = await db
			.select()
			.from(users)
			.where(eq(users.googleId, googleUser.sub));
		const existingGoogleUser = existingUserRows[0];
		if (existingGoogleUser) {
			const session = await lucia.createSession(existingGoogleUser.id, {});
			cookieStore.set(COOKIES.AUTH_COOKIE, session.id, {
				path: "/",
				httpOnly: true,
				secure: NODE_ENV === "production",
				expires: session.expiresAt,
				domain: env.NEXT_PUBLIC_APP_DOMAIN,
				sameSite: "lax",
			});
			return NextResponse.redirect(redirectUrl);
		}

		const existingUserWithEmailRows = await db
			.select()
			.from(users)
			.where(eq(users.emailAddress, googleUser.email));
		const existingUserWithEmail = existingUserWithEmailRows[0];
		if (existingUserWithEmail) {
			if (existingUserWithEmail.isEmailAddressVerified === false) {
				throw new ApiError(
					403,
					"Email address not verified. Please verify your email address to continue to login with Google.",
				);
			}
			await db
				.update(users)
				.set({ googleId: googleUser.sub })
				.where(eq(users.id, existingUserWithEmail.id));
			if (existingUserWithEmail.avatarUrl === null) {
				await db
					.update(users)
					.set({ avatarUrl: googleUser.picture })
					.where(eq(users.id, existingUserWithEmail.id));
			}
			const session = await lucia.createSession(existingUserWithEmail.id, {});
			cookieStore.set(COOKIES.AUTH_COOKIE, session.id, {
				path: "/",
				httpOnly: true,
				secure: NODE_ENV === "production",
				expires: session.expiresAt,
				domain: env.NEXT_PUBLIC_APP_DOMAIN,
				sameSite: "lax",
			});
			return NextResponse.redirect(redirectUrl);
		}

		const newUserRows = await db
			.insert(users)
			.values({
				googleId: googleUser.sub,
				name: googleUser.name,
				avatarUrl: googleUser.picture,
				emailAddress: googleUser.email,
				isEmailAddressVerified: true,
				role: "user",
			})
			.returning();
		const newUser = newUserRows[0];
		if (!newUser) {
			throw new ApiError(500, "Failed to create new user");
		}

		const session = await lucia.createSession(newUser.id, {});
		cookieStore.set(COOKIES.AUTH_COOKIE, session.id, {
			path: "/",
			httpOnly: true,
			secure: NODE_ENV === "production",
			expires: session.expiresAt,
			domain: env.NEXT_PUBLIC_APP_DOMAIN,
			sameSite: "lax",
		});
		return NextResponse.redirect(redirectUrl);
	} catch (e) {
		console.error(e);
		if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
			// invalid code
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
});

interface GoogleUser {
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
}
