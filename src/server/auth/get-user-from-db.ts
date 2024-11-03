import { db } from "@/db";
import { verifyPassword } from "@/utils/password";

export const getUserFromDb = async (email: string, pwHash: string) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email),
	});
	if (!user) return null;

	const isPasswordValid = await verifyPassword(user.passwordHash, pwHash);
	if (!isPasswordValid) return null;

	return user;
};
