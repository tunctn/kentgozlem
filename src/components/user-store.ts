import type { AuthUser } from "@/db/schema";
import { create } from "zustand";
interface UserStore {
	user: AuthUser | null;
	setUser: (user: AuthUser | null) => void;
}
export const useUserStore = create<UserStore>()((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
