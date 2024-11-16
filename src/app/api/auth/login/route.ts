import { db } from "@/db";
import { type AuthUser, users } from "@/db/schema";
import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { ApiError } from "@/lib/server/error-handler";
import { signInSchema } from "@/lib/zod";
import { verifyPassword } from "@/utils/password";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signInSchema }).loose(async (req) => {
	const { email, password } = req.body;

	// Check if user already exists
	const existingUsers = await db.select().from(users).where(eq(users.emailAddress, email));
	const existingUser = existingUsers[0];
	if (!existingUser) {
		throw new ApiError(400, "Kullanıcı bulunamadı veya şifre yanlış");
	}

	// This is not an OAuth user, so check for password hash
	if (!existingUser.passwordHash) {
		throw new ApiError(400, "Kullanıcı bulunamadı veya şifre yanlış");
	}

	// logic to verify if the user exists
	const dbuser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.emailAddress, email),
	});
	if (!dbuser) throw new ApiError(400, "Kullanıcı bulunamadı veya şifre yanlış");
	if (!dbuser.passwordHash) throw new ApiError(400, "Kullanıcı bulunamadı veya şifre yanlış");

	const isPasswordValid = await verifyPassword(dbuser.passwordHash, password);
	if (!isPasswordValid) throw new ApiError(400, "Kullanıcı bulunamadı veya şifre yanlış");
	// return JSON object with the user data

	const session = await lucia.createSession(existingUser.id, {});

	const cookieStore = await cookies();
	cookieStore.set(COOKIES.AUTH_COOKIE, session.id, {
		path: "/",
		httpOnly: true,
		secure: NODE_ENV === "production",
		expires: session.expiresAt,
		domain: env.NEXT_PUBLIC_APP_DOMAIN,
		sameSite: "lax",
	});

	const response: AuthUser = {
		id: dbuser.id,
		googleId: dbuser.googleId,
		name: dbuser.name,
		email: dbuser.emailAddress,
		role: dbuser.role,
	};
	return NextResponse.json({ user: response }, { status: 201 });
});
