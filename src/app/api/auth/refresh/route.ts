import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { signInSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signInSchema }).protected(async (req) => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (!sessionCookie) return NextResponse.json({ message: "No session cookie" }, { status: 401 });
	const { session, user } = await lucia.validateSession(sessionCookie.value);
	if (session?.fresh) {
		cookieStore.set(COOKIES.AUTH_COOKIE, lucia.createSessionCookie(session.id).serialize());
	}
	if (!session || !user) {
		cookieStore.set(COOKIES.AUTH_COOKIE, lucia.createBlankSessionCookie().serialize());
	}
	return NextResponse.json({ message: "Refreshed" }, { status: 201 });
});
