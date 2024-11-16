import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { signInSchema } from "@/lib/zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signInSchema }).protected(async (req) => {
	await lucia.invalidateSession(req.session.id);
	const cookieStore = await cookies();
	const blankSessionCookie = lucia.createBlankSessionCookie();
	cookieStore.set(COOKIES.AUTH_COOKIE, blankSessionCookie.serialize());

	return NextResponse.json({ message: "Logged out" }, { status: 201 });
});
