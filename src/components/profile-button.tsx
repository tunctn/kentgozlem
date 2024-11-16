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
import Link from "next/link";

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

				<DropdownMenuItem>
					<Link href="/api/auth/logout">Çıkış Yap</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
