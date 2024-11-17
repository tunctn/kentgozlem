"use client";

import { useUserStore } from "@/components/user-store";
import type { AuthUser } from "@/db/schema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({
	children,
	user,
}: { children: React.ReactNode; user: AuthUser | null }) {
	const { setUser } = useUserStore();
	useEffect(() => {
		setUser(user);
	}, [user, setUser]);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
