"use client";
import type { AuthUser } from "@/db/schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Bell, LogOut, Settings, User, UserIcon } from "lucide-react";

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

	const UserAvatar = ({ className }: { className?: string }) => {
		return (
			<Avatar className={cn("h-8 w-8 rounded-lg", className)}>
				<AvatarImage
					src={user.avatar_url ?? undefined}
					alt={user.name ?? undefined}
					referrerPolicy="no-referrer"
				/>
				<AvatarFallback className="rounded-lg">
					<UserIcon size={16} />
				</AvatarFallback>
			</Avatar>
		);
	};

	const UserLabel = ({ className }: { className?: string }) => {
		return (
			<div className={cn("flex items-center gap-2 px-2 py-1 text-left text-sm w-full", className)}>
				<UserAvatar className="h-8 w-8 rounded-lg" />
				<div className="flex flex-col w-full gap-0.5 text-left text-sm leading-tight">
					<span className="truncate font-semibold">{user.name}</span>
					<span className="truncate text-xs font-normal text-muted-foreground">
						{user.email_address ?? ""}
					</span>
				</div>
			</div>
		);
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<UserAvatar />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					<UserLabel className="px-0 py-0" />
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Settings size={16} />
						Tema
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<User size={16} />
							Profil
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Bell size={16} />
							Bildirimler
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
					<LogOut size={16} />
					Çıkış Yap
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
