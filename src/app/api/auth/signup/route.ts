import { db } from "@/db";
import { type AuthUser, users } from "@/db/schema";
import { COOKIES } from "@/lib/cookies";
import { NODE_ENV, env } from "@/lib/env";
import { lucia } from "@/lib/lucia";
import { apiRoute } from "@/lib/server";
import { ApiError } from "@/lib/server/error-handler";
import { signupSchema } from "@/lib/zod";
import { saltAndHashPassword } from "@/utils/password";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signupSchema }).loose(async (req) => {
	const { email, password, name } = req.body;

	// Check if user already exists
	const existingUsers = await db.select().from(users).where(eq(users.emailAddress, email));
	const existingUser = existingUsers[0];
	if (existingUser) {
		throw new ApiError(400, "Bu e-posta adresi zaten kullanılıyor");
	}

	// Hash password
	const passwordHash = await saltAndHashPassword(password);

	// Create new user
	const [newUser] = await db
		.insert(users)
		.values({
			emailAddress: email,
			passwordHash,
			name,
			role: "user",
		})
		.returning();
	if (!newUser) throw new ApiError(500, "Kullanıcı oluşturulamadı");

	const session = await lucia.createSession(newUser.id, {});
	const cookieStore = await cookies();
	cookieStore.set(COOKIES.AUTH_COOKIE, session.id, {
		path: "/",
		httpOnly: true,
		domain: env.NEXT_PUBLIC_APP_DOMAIN,
		secure: NODE_ENV === "production",
		expires: session.expiresAt,
		sameSite: "lax",
	});

	const user: AuthUser = {
		id: newUser.id,
		googleId: newUser.googleId,
		name: newUser.name,
		email: newUser.emailAddress,
		role: newUser.role,
	};

	return NextResponse.json({ user }, { status: 201 });
});
