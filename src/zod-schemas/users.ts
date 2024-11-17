import type { AuthUser } from "@/db/schema";
import type { Session } from "lucia";

export type GetMeResponse = {
	user: AuthUser;
	session: Session;
};
