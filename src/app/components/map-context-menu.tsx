"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Portal } from "@radix-ui/react-portal";
import { Flag, MapIcon, MapPinned, SquareArrowOutUpRight } from "lucide-react";
import { useRef } from "react";
import { useMapStore } from "./map-store";

export default function MapContextMenu() {
	const portalRef = useRef<HTMLDivElement>(null);
	const { contextMenu, setContextMenu } = useMapStore();

	return (
		<Portal
			ref={portalRef}
			id="map-portal"
			className="absolute w-[1px] h-[1px]"
			style={{
				left: `${contextMenu.spawnCoords.x}px`,
				top: `${contextMenu.spawnCoords.y}px`,
			}}
		>
			<DropdownMenu
				open={contextMenu.open}
				onOpenChange={(open) => setContextMenu({ ...contextMenu, open })}
			>
				<DropdownMenuTrigger />
				<DropdownMenuContent
					className="-mt-4"
					align="start"
					side="right"
					sideOffset={0}
					alignOffset={0}
					onContextMenu={(e) => e.preventDefault()}
				>
					<DropdownMenuLabel className="flex items-center gap-2">
						<MapPinned size={16} />
						{contextMenu.mapCoords.lat}, {contextMenu.mapCoords.lng}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Flag size={16} />
						Bildir
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							window.open(
								`https://www.google.com/maps/search/?api=1&query=${contextMenu.mapCoords.lat},${contextMenu.mapCoords.lng}`,
								"_blank",
							);
						}}
					>
						<MapIcon size={16} />
						Google Haritalar'da Aç
						<SquareArrowOutUpRight size={16} className="ml-5" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</Portal>
	);
}
