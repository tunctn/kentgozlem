import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export async function getUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (!sessionCookie) return { user: null, session: null };

	const { session, user } = await lucia.validateSession(sessionCookie.value);
	return { session, user };
}
