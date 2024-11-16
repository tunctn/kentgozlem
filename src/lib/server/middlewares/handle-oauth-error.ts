import { COOKIES } from "@/lib/cookies";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiMiddleware } from "./builder";

type HandleOauthErrorResponse = { errorUrl: string } | NextResponse<unknown>;

export const handleOauthError = apiMiddleware<HandleOauthErrorResponse>(async (req) => {
	const cookieStore = await cookies();
	const query = req.query as { error?: string };
	const error = query.error?.toString() ?? null;

	const redirectUrl = cookieStore.get(COOKIES.AUTH_REDIRECT)?.value;
	const oauthFlowStartUrl = cookieStore.get(COOKIES.OAUTH_FLOW_START_URL)?.value;

	const errorUrl = oauthFlowStartUrl ?? redirectUrl ?? undefined;

	if (error) {
		if (errorUrl) {
			const url = new URL(errorUrl);
			const existingError = url.searchParams.get("error");
			if (existingError) {
				url.searchParams.set("error", error);
			} else {
				url.searchParams.append("error", error);
			}
			return NextResponse.redirect(url.toString());
		}
		return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL);
	}

	return { errorUrl: errorUrl ?? "" };
});
