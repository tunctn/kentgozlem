import { db } from "@/db";
import { users } from "@/db/schema";
import { apiRoute } from "@/lib/server";
import { ApiError } from "@/lib/server/error-handler";
import { signupSchema } from "@/lib/zod";
import { saltAndHashPassword } from "@/utils/password";
import { NextResponse } from "next/server";

export const POST = apiRoute({ body: signupSchema }).loose(async (req) => {
	const { email, password, name } = await req.json();

	// Check if user already exists
	const existingUser = await db.query.users.findFirst({
		where: (table, { eq }) => eq(table.email, email),
	});
	if (existingUser) {
		throw new ApiError(400, "User already exists");
	}

	// Hash password
	const hashedPassword = await saltAndHashPassword(password);

	// Create new user
	const userRows = await db
		.insert(users)
		.values({
			email,
			passwordHash: hashedPassword,
			name,
		})
		.returning();
	const user = userRows[0];

	// Remove password from response
	const { passwordHash: _, ...userWithoutPassword } = user;

	return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
});
