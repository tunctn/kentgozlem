"use client";

import { useReports } from "@/lib/api/use-reports";
import debounce from "lodash.debounce";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { type BoundingBox, useMapStore } from "../components/map-store";
import type { MapViewState } from "../components/mapbox";
import { Marker } from "../components/marker";

export const MapReports = () => {
	const {
		map,
		viewState,
		currentBoundingBox,
		setIsFetchingReports,
		mapReportPopupId,
		mapMarkers,
		setMapMarkers,
	} = useMapStore();

	const debouncedUpdateQuery = useCallback(
		debounce((viewState: MapViewState, currentBoundingBox: BoundingBox) => {
			if (!viewState || !currentBoundingBox) return null;

			return {
				sw_lat: currentBoundingBox.sw_lat,
				sw_lng: currentBoundingBox.sw_lng,
				ne_lat: currentBoundingBox.ne_lat,
				ne_lng: currentBoundingBox.ne_lng,
				zoom: viewState.zoom,
			};
		}, 300),
		[],
	);

	const reports = useReports({
		query: debouncedUpdateQuery(viewState, currentBoundingBox) ?? null,
	});

	useEffect(() => {
		if (!map || !reports.data) return;
		if (reports.isLoading) return;

		const newMapMarkers: typeof mapMarkers = new Map();
		const newMapPopups: mapboxgl.Popup[] = [];

		for (const report of reports.data.reports) {
			const element = document.createElement("div");
			const root = createRoot(element);
			root.render(<Marker report={report} />);

			// const popupElement = document.createElement("div");
			// const popupRoot = createRoot(popupElement);
			// popupRoot.render(<PopupContent reportId={report.id} />);
			// const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupElement);

			const marker = new mapboxgl.Marker(element)
				// .setPopup(popup)
				.setLngLat([Number.parseFloat(report.longitude), Number.parseFloat(report.latitude)])
				.addTo(map);
			newMapMarkers.set(report.id, marker);
			// newMapPopups.push(popup);
		}
		setMapMarkers(newMapMarkers);

		return () => {
			for (const marker of newMapMarkers.values()) {
				marker.remove();
			}
			// for (const popup of newMapPopups) {
			// 	popup.remove();
			// }
		};
	}, [map, reports.isLoading, reports.data, setMapMarkers]);

	useEffect(() => {
		setIsFetchingReports(reports.isLoading);
	}, [reports.isLoading, setIsFetchingReports]);

	return null;
};
