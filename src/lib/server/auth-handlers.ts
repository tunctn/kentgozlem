import type { NextRequest } from "next/server";
import { auth } from "../auth";
import type { AuthUser } from "../auth.config";
import type { ApiRequest, ApiRequestContext } from "./api-route";
import { ApiError, withErrorHandler } from "./error-handler";

const getUserFromRequest = async (_req: NextRequest) => {
	const session = await auth();
	if (!session?.user) throw new ApiError(401, "Unauthorized");
	return session.user as AuthUser;
};
type AuthRequest = ApiRequest & { user: AuthUser };
export const withAuth = <T>(fn: (req: AuthRequest, context: ApiRequestContext) => Promise<T>) => {
	return withErrorHandler(async (req, context) => {
		const user = await getUserFromRequest(req);
		return fn(
			{
				...req,
				user,
			} as AuthRequest,
			context,
		);
	});
};

const getLooseUserFromRequest = async (_req: NextRequest) => {
	const session = await auth();
	return session?.user as AuthUser | null;
};
type LooseAuthRequest = ApiRequest & { user: AuthUser | null };
export const withLooseAuth = <T>(
	fn: (req: LooseAuthRequest, context: ApiRequestContext) => Promise<T>,
) => {
	return withErrorHandler(async (req, context) => {
		const user = await getLooseUserFromRequest(req);
		return fn(
			{
				...req,
				user,
			} as LooseAuthRequest,
			context,
		);
	});
};