"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import * as Slider from "@radix-ui/react-slider";
import { LocateFixed, Minus, Plus } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { memo, useCallback, useEffect, useRef } from "react";
import { Compass } from "./compass";
import { CurrentLocationMarker } from "./current-location-marker";
import { useMapStore } from "./map-store";

export const MapControls = memo(() => {
	const currentLocationMarker = useRef<HTMLDivElement>(null);
	const { map, viewState, locateUser, userCoords } = useMapStore();

	useEffect(() => {
		locateUser();
	}, [locateUser]);

	useEffect(() => {
		if (!map) return;
		if (!currentLocationMarker.current) return;

		if (userCoords.lat !== 0 && userCoords.lng !== 0) {
			new mapboxgl.Marker(currentLocationMarker.current).setLngLat(userCoords).addTo(map);
		}
	}, [map, userCoords]);

	const handlePitchChange = useCallback(
		(value: number[]) => {
			if (!map) return;
			map.jumpTo({ pitch: value[0] });
		},
		[map],
	);

	const handleZoomIn = useCallback(() => {
		map?.easeTo({ zoom: map.getZoom() + 1 });
	}, [map]);

	const handleZoomOut = useCallback(() => {
		map?.easeTo({ zoom: map.getZoom() - 1 });
	}, [map]);

	return (
		<div className="flex gap-1 items-end h-full">
			<div className="flex flex-col items-center gap-2">
				{userCoords.lat !== 0 && userCoords.lng !== 0 && (
					<CurrentLocationMarker ref={currentLocationMarker} />
				)}

				<Button variant="glass" size="xs-icon" className="rounded-lg" onClick={locateUser}>
					<LocateFixed size={16} />
				</Button>
				<ButtonGroup className="flex flex-col items-center" variant="glass">
					<Button variant="glass" grouped={true} size="2xs-icon" onClick={handleZoomIn}>
						<Plus size={16} />
					</Button>
					<Button variant="glass" grouped={true} size="2xs-icon" onClick={handleZoomOut}>
						<Minus size={16} />
					</Button>
				</ButtonGroup>
			</div>

			<div className="flex flex-col items-center gap-2">
				<Compass degree={viewState.bearing} />

				<div className="w-[30px] h-[60px] rounded-lg flex items-center justify-center py-3 glass-looking">
					<Slider.Root
						className="relative flex h-full w-5 touch-none select-none items-center"
						max={85}
						step={1}
						value={[viewState.pitch ?? 1]}
						orientation="vertical"
						onValueChange={handlePitchChange}
					>
						<Slider.Track className="relative h-full w-[3px] left-1/2 -translate-x-1/2 rounded-full bg-foreground/10">
							<Slider.Range className="absolute h-full rounded-full bg-white" />
						</Slider.Track>
						<Slider.Thumb
							className="block size-2 ml-[6px] rounded-[10px] cursor-grab active:cursor-grabbing !bg-foreground !bg-foreground/60 hover:!bg-foreground focus:outline-none"
							aria-label="Volume"
						/>
					</Slider.Root>
				</div>
			</div>
		</div>
	);
});

MapControls.displayName = "MapControls";
