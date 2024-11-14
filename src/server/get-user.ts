import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";

export async function getUser(session: Session) {
	const userId = session.user?.id;
	if (!userId) throw new Error("Session user not found");
	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, userId),
	});
	if (!dbUser) throw new Error("User not found");

	const { passwordHash, ...user } = dbUser;
	return user;
}
