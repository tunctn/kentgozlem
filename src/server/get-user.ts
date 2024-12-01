import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import type { GetMeResponse } from "@/zod-schemas/users";
import { cookies } from "next/headers";

export async function getUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (!sessionCookie) return { user: null, session: null };

	const { user, session } = await lucia.validateSession(sessionCookie.value);
	if (!user || !session) return { user: null, session: null };

	const response: GetMeResponse = { user, session };
	return response;
}
