"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { env } from "@/lib/env";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { type MapViewState, type UserCoords, getFromLocalStorage } from "@/utils/local-storage";
import { defaultViewState, useMapStore } from "./map-store";

const refineMapCoord = (coord: number) => {
	return Math.round(coord * 1000000) / 1000000;
};

export const Mapbox = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const { setMap, setContextMenu, setViewState } = useMapStore();

	useEffect(() => {
		if (!mapContainerRef.current) return;

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

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			accessToken: env.NEXT_PUBLIC_MAPBOX_API_KEY,
			style: "mapbox://styles/mapbox/standard",
			projection: "globe",
			language: "tr",
			...viewState,
		});
		setMap(map);

		map.on("contextmenu", (e) => {
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

			const availableLightPresets = ["dusk", "night", "dawn", "day"] as const;

			// Get current time and create Date object
			const now = new Date();
			const hours = now.getHours();

			// Simple time-based light preset selection
			let lightPreset: (typeof availableLightPresets)[number];
			if (hours >= 5 && hours < 7) {
				lightPreset = "dawn";
			} else if (hours >= 7 && hours < 17) {
				lightPreset = "day";
			} else if (hours >= 17 && hours < 19) {
				lightPreset = "dusk";
			} else {
				lightPreset = "night";
			}

			map.setConfigProperty("basemap", "lightPreset", lightPreset);
		});
	}, [setMap, setContextMenu, setViewState]);

	return <div className="h-full w-full" ref={mapContainerRef} />;
};
