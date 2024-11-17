import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { googleOauth } from "@/lib/lucia";
import { apiRoute, saveOauthFlowStart } from "@/lib/server";
import { saveOauthRedirectUrl } from "@/lib/server/middlewares/save-oauth-redirect-url";

import { z } from "@/lib/zod";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = apiRoute({ query: z.object({ redirect_url: z.string().optional() }) })
	.withMiddleware(saveOauthFlowStart())
	.withMiddleware(saveOauthRedirectUrl())
	.loose(async (req) => {
		const redirectUrl = req.redirectUrl;
		if (!redirectUrl) {
			return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);
		}

		const cookieStore = await cookies();
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = googleOauth.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

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
	});
