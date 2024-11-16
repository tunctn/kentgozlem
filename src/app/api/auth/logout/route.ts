import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = apiRoute({}).loose(async (req) => {
	const sessionId = req.session?.id;
	if (sessionId) {
		await lucia.invalidateSession(sessionId);
	}

	const cookieStore = await cookies();
	cookieStore.delete(COOKIES.AUTH_COOKIE);

	return NextResponse.json({ message: "Logged out" }, { status: 200 });
});
