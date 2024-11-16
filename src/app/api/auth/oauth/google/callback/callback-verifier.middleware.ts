import { COOKIES } from "@/lib/cookies";
import { ApiError } from "@/lib/server/error-handler";
import { apiMiddleware } from "@/lib/server/middlewares/builder";
import { cookies } from "next/headers";

type CallbackVerified = {
	code: string;
	storedCodeVerifier: string;
	redirectUrl: string;
};

export const callbackVerifier = apiMiddleware<CallbackVerified>(async (req) => {
	const cookieStore = await cookies();
	const query = req.query as { code?: string; state?: string };

	const code = query.code?.toString() ?? null;
	const state = query.state?.toString() ?? null;
	const redirectUrl = cookieStore.get(COOKIES.AUTH_REDIRECT)?.value;

	const storedState = cookieStore.get(COOKIES.GOOGLE_OAUTH_STATE)?.value;
	const storedCodeVerifier = cookieStore.get(COOKIES.GOOGLE_OAUTH_CODE_VERIFIER)?.value;

	if (!code) {
		throw new ApiError(400, "code search parameter is required");
	}
	if (!state) {
		throw new ApiError(400, "state search parameter is required");
	}
	if (!storedState) {
		throw new ApiError(400, "storedState cookie is required");
	}
	if (!storedCodeVerifier) {
		throw new ApiError(400, "storedCodeVerifier cookie is required");
	}
	if (state !== storedState) {
		throw new ApiError(400, "state search parameter does not match storedState cookie");
	}
	if (!redirectUrl) {
		throw new ApiError(400, "redirectUrl is required");
	}

	return {
		code,
		storedCodeVerifier,
		redirectUrl,
	};
});
