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
import { Flag, MapIcon, MapPinned, Pin, SquareArrowOutUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useMapStore } from "./map-store";
import { NewReportModal } from "./new-report-modal";

export default function MapContextMenu() {
	const portalRef = useRef<HTMLDivElement>(null);
	const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
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
				key={`${contextMenu.open}-${contextMenu.mapCoords.lat}-${contextMenu.mapCoords.lng}`}
				open={contextMenu.open}
				onOpenChange={(open) => setContextMenu({ ...contextMenu, open })}
			>
				{contextMenu.open && (
					<div className="h-[30px] w-[30px] absolute -top-[15px] -left-[15px] rounded-full bg-linear-to-b from-blue-500 to-blue-600 border-blue-400 border shadow-md flex items-center justify-center">
						<Pin size={16} className="text-white" />
					</div>
				)}
				<DropdownMenuTrigger />
				<DropdownMenuContent align="start" side="right" sideOffset={10} alignOffset={10}>
					<DropdownMenuLabel className="flex items-center gap-2">
						<MapPinned size={16} />
						{contextMenu.mapCoords.lat}, {contextMenu.mapCoords.lng}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<NewReportModal
						isOpen={isNewReportModalOpen}
						onOpenChange={setIsNewReportModalOpen}
						lat={contextMenu.mapCoords.lat}
						lng={contextMenu.mapCoords.lng}
						trigger={
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									setIsNewReportModalOpen(true);
								}}
							>
								<Flag size={16} />
								Bildir
							</DropdownMenuItem>
						}
					/>
					<DropdownMenuItem
						onClick={() => {
							window.open(
								`https://www.google.com/maps/search/?api=1&query=${contextMenu.mapCoords.lat},${contextMenu.mapCoords.lng}`,
								"_blank",
							);
						}}
						className="cursor-pointer"
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
