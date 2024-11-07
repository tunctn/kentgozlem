"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { env } from "@/lib/env";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { getFromLocalStorage, saveToLocalStorage } from "@/utils/local-storage";

import { useMapboxStore } from "./mapbox-store";

export const Mapbox = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const { setMap } = useMapboxStore();

	useEffect(() => {
		if (!mapContainerRef.current) return;

		// Load saved view state or use defaults
		const savedViewState = getFromLocalStorage("mapViewState") || {
			center: [29.026005309371357, 41.01624869192369],
			zoom: 11.5,
			pitch: 0,
			bearing: 0,
		};

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			accessToken: env.NEXT_PUBLIC_MAPBOX_API_KEY,
			style: "mapbox://styles/mapbox/standard",
			projection: "globe",
			language: "tr",
			...savedViewState,
		});
		setMap(map);

		// Save view state when map moves
		map.on("moveend", () => {
			if (!map) return;

			const viewState = {
				center: map.getCenter().toArray(),
				zoom: map.getZoom(),
			};

			saveToLocalStorage("mapViewState", viewState);
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
	}, [setMap]);

	return <div className="h-full w-full" ref={mapContainerRef} />;
};
