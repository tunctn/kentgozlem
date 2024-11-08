"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Portal } from "@radix-ui/react-portal";
import { MapPinned } from "lucide-react";
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
					<DropdownMenuItem>
						<MapPinned size={16} />
						{contextMenu.mapCoords.lat}, {contextMenu.mapCoords.lng}
					</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</Portal>
	);
}
