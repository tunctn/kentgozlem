"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { env } from "@/lib/env";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { type MapViewState, type UserCoords, getFromLocalStorage } from "@/utils/local-storage";
import { defaultViewState, useMapStore } from "./map-store";

const refineMapCoord = (coord: number) => {
	return Math.round(coord * 1000000) / 1000000;
};

const AUTH_MAP_VIEW_STATE: MapViewState = {
	center: [28.990128549187148, 41.04179842144478],
	zoom: 13.867394781592099,
	pitch: 72.9473972141095,
	bearing: 0,
};

interface MapboxProps {
	authMap?: boolean;
	staticState?: MapViewState;
	disableInteractions?: boolean;
}

export const Mapbox = ({
	authMap,
	staticState: staticStateProp,
	disableInteractions,
}: MapboxProps) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const { setMap, setContextMenu, lightPreset, setViewState, setLoaded } = useMapStore();

	useEffect(() => {
		if (!mapContainerRef.current) return;
		let staticState = staticStateProp;
		if (authMap) {
			staticState = AUTH_MAP_VIEW_STATE;
			disableInteractions = true;
		}

		const localViewState = getFromLocalStorage("map-view-state") as MapViewState | null;
		const lastUserCoords = getFromLocalStorage("last-user-coords") as UserCoords | null;

		let viewState: MapViewState = defaultViewState;
		if (lastUserCoords) {
			viewState = {
				center: lastUserCoords,
				zoom: 15.5,
				pitch: 0,
				bearing: 0,
			};
		} else if (localViewState) {
			viewState = localViewState;
		}

		if (staticState) viewState = staticState;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			accessToken: env.NEXT_PUBLIC_MAPBOX_API_KEY,
			style: "mapbox://styles/mapbox/standard",
			projection: "globe",
			language: "tr",
			...viewState,

			dragPan: !disableInteractions,
			dragRotate: !disableInteractions,
			scrollZoom: !disableInteractions,
			touchPitch: !disableInteractions,
			touchZoomRotate: !disableInteractions,
			doubleClickZoom: !disableInteractions,
			keyboard: !disableInteractions,

			config: {
				basemap: {
					lightPreset: lightPreset,
				},
			},
		});
		setMap(map);

		if (authMap) {
			const rotateCamera = () => {
				map.easeTo({
					bearing: map.getBearing() + 0.005,
					duration: 0,
					easing: (t) => t,
				});
				requestAnimationFrame(rotateCamera);
			};
			rotateCamera();
		}

		map.on("contextmenu", (e) => {
			if (staticState) return;
			e.preventDefault();

			map.stop();

			setContextMenu({
				open: true,
				spawnCoords: {
					x: e.point.x,
					y: e.point.y,
				},
				mapCoords: {
					lat: refineMapCoord(e.lngLat.lat),
					lng: refineMapCoord(e.lngLat.lng),
				},
			});
		});

		// Save view state when map moves
		map.on("moveend", () => {
			if (!map) return;
			if (authMap) return;
			if (staticState) return;

			const viewState: MapViewState = {
				center: map.getCenter().toArray(),
				zoom: map.getZoom(),
				pitch: map.getPitch(),
				bearing: map.getBearing(),
			};
			setViewState({ viewState, saveCookie: true });
		});

		map.on("move", () => {
			if (!map) return;
			if (authMap) return;
			if (staticState) return;

			const viewState: MapViewState = {
				center: map.getCenter().toArray(),
				zoom: map.getZoom(),
				pitch: map.getPitch(),
				bearing: map.getBearing(),
			};
			setViewState({ viewState, saveCookie: false });
		});

		map.on("style.load", () => {
			if (!map) return;

			setLoaded(true);
		});
	}, [
		setMap,
		setContextMenu,
		setViewState,
		staticStateProp,
		authMap,
		disableInteractions,
		setLoaded,
		lightPreset,
	]);

	return (
		<div className={cn("h-full w-full", authMap && "pointer-events-none")} ref={mapContainerRef} />
	);
};
