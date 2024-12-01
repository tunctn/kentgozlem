import type { AuthUser } from "@/db/schema";
import type { Session } from "lucia";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { COOKIES } from "../cookies";
import { lucia } from "../lucia";
import type { ApiRequest, ApiRequestContext } from "./api-route";
import { ApiError } from "./error-handler";
import { mergeRequest } from "./utils/merge-request";

const getUserFromRequest = async (_req: NextRequest) => {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get(COOKIES.AUTH_COOKIE)?.value;

	if (!sessionId) return { user: null, session: null };

	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		cookieStore.set(COOKIES.AUTH_COOKIE, lucia.createSessionCookie(session.id).serialize());
	}
	if (!session || !user) {
		cookieStore.set(COOKIES.AUTH_COOKIE, lucia.createBlankSessionCookie().serialize());

		return { user: null, session: null };
	}

	return { user, session };
};

type AuthRequest = ApiRequest & { user: AuthUser; session: Session };
export const withAuth = <T>(fn: (req: AuthRequest, context: ApiRequestContext) => Promise<T>) => {
	return async (req: NextRequest, context: ApiRequestContext) => {
		const { session, user } = await getUserFromRequest(req);
		if (!session || !user) throw new ApiError(401, "Unauthorized");

		return fn(mergeRequest(req, { user, session }) as AuthRequest, context);
	};
};

type LooseAuthRequest = ApiRequest & { user: AuthUser | null; session: Session | null };
export const withLooseAuth = <T>(
	fn: (req: LooseAuthRequest, context: ApiRequestContext) => Promise<T>,
) => {
	return async (req: NextRequest, context: ApiRequestContext) => {
		const { session, user } = await getUserFromRequest(req);
		return fn(mergeRequest(req, { user, session }) as LooseAuthRequest, context);
	};
};
