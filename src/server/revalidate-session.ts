import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export const revalidateSession = async () => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (sessionCookie) {
		const { session, user } = await lucia.validateSession(sessionCookie.value);
		if (session?.fresh) {
			cookieStore.set(COOKIES.AUTH_COOKIE, lucia.createSessionCookie(session.id).serialize());
		}
		if (!session || !user) {
			cookieStore.delete(COOKIES.AUTH_COOKIE);
		}
	}
};
