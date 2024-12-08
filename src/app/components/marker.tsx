"use client";

import { cn } from "@/lib/utils";
import { Portal } from "@radix-ui/react-portal";
import { useMapStore } from "./map-store";

interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	lat: number;
	lng: number;
	className?: string;
	interactive?: boolean;
}
export const Marker = ({
	children,
	lat,
	lng,
	className,
	interactive = false,
	style,
	...props
}: MarkerProps) => {
	const map = useMapStore().map;
	if (!map) return null;
	const relativeToMap = map?.project([lng, lat]);
	const mapboxCanvasContainer = document.getElementsByClassName("mapboxgl-canvas-container")[0];

	return (
		<Portal container={mapboxCanvasContainer}>
			<div
				className={cn(
					"mapboxgl-marker",
					"absolute top-0 left-0 z-10 will-change-auto touch-none select-none",
					className,
				)}
				data-interactive={interactive}
				style={{
					transform: `translate3d(${relativeToMap?.x}px, ${relativeToMap?.y}px, 0)`,
					...style,
				}}
				{...props}
			>
				<div className="relative -translate-x-1/2 -translate-y-1/2">{children}</div>
			</div>
		</Portal>
	);
};
