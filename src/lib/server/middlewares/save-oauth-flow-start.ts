import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { cookies } from "next/headers";
import { apiMiddleware } from "./builder";

export const saveOauthFlowStart = apiMiddleware<{ clientUrl: string | null }>(async (req) => {
	const clientUrl = req.headers.get("referer");
	const cookieStore = await cookies();

	if (!clientUrl) return { clientUrl: null };

	cookieStore.set(COOKIES.OAUTH_FLOW_START_URL, clientUrl, {
		path: "/",
		secure: NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		domain: env.NEXT_PUBLIC_APP_DOMAIN,
		sameSite: "lax",
	});

	return { clientUrl };
});
