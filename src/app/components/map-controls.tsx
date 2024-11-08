"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { LocateFixed, Minus, Plus } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { Compass } from "./compass";
import { CurrentLocationMarker } from "./current-location-marker";
import { useMapStore } from "./map-store";

export const MapControls = () => {
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

	return (
		<div className="flex flex-col items-center gap-2">
			<Compass degree={viewState.bearing} />

			{userCoords.lat !== 0 && userCoords.lng !== 0 && (
				<CurrentLocationMarker ref={currentLocationMarker} />
			)}

			<Button variant="glass" size="icon" onClick={locateUser}>
				<LocateFixed size={16} />
			</Button>
			{/* Zoom Buttons */}
			<ButtonGroup className="flex flex-col items-center" variant="glass">
				<Button
					variant="glass"
					grouped={true}
					size="sm-icon"
					onClick={() => map.easeTo({ zoom: map.getZoom() + 1 })}
				>
					<Plus size={16} />
				</Button>
				<Button
					variant="glass"
					grouped={true}
					size="sm-icon"
					onClick={() => map.easeTo({ zoom: map.getZoom() - 1 })}
				>
					<Minus size={16} />
				</Button>
			</ButtonGroup>
		</div>
	);
};
