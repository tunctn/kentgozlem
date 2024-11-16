import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { googleOauth } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";

import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = apiRoute({ query: z.object({ redirect_url: z.string() }) }).loose(
	async (req) => {
		const cookieStore = await cookies();

		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = googleOauth.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

		cookieStore.set(COOKIES.AUTH_REDIRECT, req.query.redirect_url, {
			path: "/",
			secure: NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			domain: env.NEXT_PUBLIC_APP_DOMAIN,
			sameSite: "lax",
		});

		cookieStore.set(COOKIES.GOOGLE_OAUTH_STATE, state, {
			path: "/",
			secure: NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
			domain: env.NEXT_PUBLIC_APP_DOMAIN,
		});

		cookieStore.set(COOKIES.GOOGLE_OAUTH_CODE_VERIFIER, codeVerifier, {
			path: "/",
			secure: NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
			domain: env.NEXT_PUBLIC_APP_DOMAIN,
		});

		return NextResponse.redirect(url.toString());
	},
);
