import type { db } from "@/db";
import type { AuthUser } from "@/lib/auth.config";

export type Service = {
	tx?: typeof db;
};
export type UserService = Service & {
	user: AuthUser;
};
export type LooseUserService = Service & {
	user: AuthUser | null;
};