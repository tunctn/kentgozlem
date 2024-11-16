import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiMiddleware } from "./builder";

type SaveOauthRedirectUrlResponse = { redirectUrl: string | null } | NextResponse;

export const saveOauthRedirectUrl = apiMiddleware<SaveOauthRedirectUrlResponse>(async (req) => {
	const redirectUrl = req.query.redirect_url;
	const cookieStore = await cookies();
	if (!redirectUrl) return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);

	cookieStore.set(COOKIES.AUTH_REDIRECT, redirectUrl, {
		path: "/",
		secure: NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		domain: env.NEXT_PUBLIC_APP_DOMAIN,
		sameSite: "lax",
	});

	return { redirectUrl };
});
