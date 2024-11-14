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
import { signOut } from "@/lib/auth";
import { cookies } from "next/headers";

export function ProfileButton({ user }: { user: AuthUser }) {
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
				<form
					action={async (formData) => {
						"use server";
						const cookieStore = await cookies();
						cookieStore.delete("redirect");
						await signOut();
					}}
				>
					<DropdownMenuItem>
						<button type="submit">Çıkış Yap</button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
