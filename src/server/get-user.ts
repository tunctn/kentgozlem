import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { ApiError } from "@/lib/server/error-handler";
import type { GetMeResponse } from "@/zod-schemas/users";
import { cookies } from "next/headers";

export async function getUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (!sessionCookie) throw new ApiError(401, "Unauthorized");

	const { user, session } = await lucia.validateSession(sessionCookie.value);
	if (!user || !session) throw new ApiError(401, "Unauthorized");

	const response: GetMeResponse = { user, session };
	return response;
}
