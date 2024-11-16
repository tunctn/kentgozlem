"use client";
import type { AuthUser } from "@/db/schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

const useLogout = () => {
	return useMutation({
		mutationFn: async () => {
			return await api.post("auth/logout").json();
		},
	});
};

export function ProfileButton({ user }: { user: AuthUser }) {
	const logout = useLogout();
	const onLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => {
				window.location.href = "/";
			},
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="bg-foreground rounded-full">
				<Avatar className="hover:opacity-90 transition-opacity ">
					<AvatarImage src={user.image ?? ""} />
					<AvatarFallback>{user.name[0]}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{user.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
					Çıkış Yap
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
