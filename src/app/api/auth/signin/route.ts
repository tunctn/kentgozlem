import { db } from "@/db";
import { apiRoute } from "@/lib/server";
import { ApiError } from "@/lib/server/error-handler";
import { signInSchema } from "@/lib/zod";
import { saltAndHashPassword, verifyPassword } from "@/utils/password";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signInSchema }).loose(async (req) => {
	const { email, password } = req.body;

	// Check if user already exists
	const existingUser = await db.query.users.findFirst({
		where: (table, { eq }) => eq(table.email, email),
	});
	if (!existingUser) {
		throw new ApiError(400, "User not found or wrong password");
	}

	// Hash password
	const hashedPassword = await saltAndHashPassword(password);

	// logic to verify if the user exists
	const dbuser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	});
	if (!dbuser) throw new ApiError(400, "User not found or wrong password");
	if (!dbuser.passwordHash) throw new ApiError(400, "User not found or wrong password");

	const isPasswordValid = await verifyPassword(dbuser.passwordHash, password);
	if (!isPasswordValid) throw new ApiError(400, "User not found or wrong password");
	// return JSON object with the user data

	const { passwordHash: _, ...userWithoutPassword } = dbuser;
	return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
});
