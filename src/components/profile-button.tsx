"use client";
import type { AuthUser } from "@/db/schema";

import { useMapStore } from "@/app/components/map-store";
import type { LightPreset } from "@/app/components/mapbox";
import { useThemeStore } from "@/app/components/theme-store";
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
import { getAutoTheme } from "@/utils/get-auto-theme";
import { useMutation } from "@tanstack/react-query";
import { Box, Check, LogIn, LogOut, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Dawn, Dusk } from "./svgs";

const useLogout = () => {
	return useMutation({
		mutationFn: async () => {
			return await api.post("auth/logout").json();
		},
	});
};

const ICON_SIZE = 14;

export function ProfileButton({ user }: { user: AuthUser | null }) {
	const autoTheme = getAutoTheme();

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
			<Avatar className={cn("h-8 w-8 rounded-lg ", className)}>
				<AvatarImage
					src={user?.avatar_url ?? undefined}
					alt={user?.name ?? undefined}
					referrerPolicy="no-referrer"
				/>
				<AvatarFallback className="rounded-lg">
					<UserIcon size={ICON_SIZE} />
				</AvatarFallback>
			</Avatar>
		);
	};

	const UserLabel = ({ className }: { className?: string }) => {
		if (!user) return null;

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

	const themeStore = useThemeStore();
	const { setTheme } = useTheme();
	const { map, setShow3dObjects, show3dObjects } = useMapStore();
	const handleTheme = (newLightPreset: LightPreset | "auto") => {
		const newTheme = newLightPreset === "day" || newLightPreset === "dawn" ? "light" : "dark";

		if (newLightPreset === "auto") {
			const autoLightPreset = getAutoTheme().lightPreset;
			const autoTheme = getAutoTheme().theme;
			themeStore.setTheme(null);
			themeStore.setLightPreset(null);

			setTheme(autoTheme);
			map?.setConfig("basemap", {
				lightPreset: autoLightPreset,
				show3dObjects: show3dObjects,
			});
		} else {
			themeStore.setTheme(newTheme);
			themeStore.setLightPreset(newLightPreset);

			setTheme(newTheme);
			map?.setConfig("basemap", {
				lightPreset: newLightPreset,
				show3dObjects: show3dObjects,
			});
		}
	};

	const toggle3d = () => {
		if (!map) return;
		setShow3dObjects(!show3dObjects);
		map?.setConfig("basemap", {
			show3dObjects: !show3dObjects,
			lightPreset: themeStore.lightPreset,
		});
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="glass-looking cursor-pointer rounded-lg">
				<UserAvatar />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-[200px]" align="end">
				{user && (
					<DropdownMenuLabel>
						<UserLabel className="px-0 py-0" />
					</DropdownMenuLabel>
				)}
				{!user && (
					<>
						<DropdownMenuItem
							asChild
							className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 hover:text-white focus:text-white mb-1"
						>
							<a href="/auth/sign-up">
								<UserIcon size={ICON_SIZE} />
								Kayıt Ol
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2">
							<a href="/auth/sign-in">
								<LogIn size={ICON_SIZE} />
								Giriş Yap
							</a>
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="cursor-pointer flex items-center gap-5 justify-between"
					onClick={toggle3d}
				>
					<span className="flex items-center gap-2">
						<Box size={ICON_SIZE} />
						3D Objeler
					</span>
					{show3dObjects ? <Check size={ICON_SIZE} /> : null}
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						{themeStore.lightPreset === "day" && <Sun size={ICON_SIZE} />}
						{themeStore.lightPreset === "dawn" && <Dawn size={ICON_SIZE} />}
						{themeStore.lightPreset === "dusk" && <Dusk size={ICON_SIZE} />}
						{themeStore.lightPreset === "night" && <Moon size={ICON_SIZE} />}
						Tema
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem onClick={() => handleTheme("auto")}>
							{autoTheme.lightPreset === "day" && <Sun size={ICON_SIZE} strokeWidth={1.5} />}
							{autoTheme.lightPreset === "dawn" && <Dawn size={ICON_SIZE} />}
							{autoTheme.lightPreset === "dusk" && <Dusk size={ICON_SIZE} />}
							{autoTheme.lightPreset === "night" && <Moon size={ICON_SIZE} strokeWidth={1.5} />}
							Otomatik
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => handleTheme("dawn")}>
							<Dusk size={ICON_SIZE} />
							Gün Doğumu
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleTheme("day")}>
							<Sun size={ICON_SIZE} strokeWidth={1.5} />
							Gün
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleTheme("dusk")}>
							<Dawn size={ICON_SIZE} />
							Gün Batımı
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleTheme("night")}>
							<Moon size={ICON_SIZE} strokeWidth={1.5} />
							Gece
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{user && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
							<LogOut size={ICON_SIZE} />
							Çıkış Yap
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
