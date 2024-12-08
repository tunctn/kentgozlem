"use client";

import { useReports } from "@/lib/api/use-reports";
import type { GetReportsResponse } from "@/server/reports/get-reports";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useMapStore } from "./map-store";
import { ReportMarker } from "./report-marker";

export const MapReports = () => {
	const { viewState, currentBoundingBox, setIsFetchingReports } = useMapStore();

	const [debouncedQuery] = useDebouncedValue(
		{
			zoom: viewState.zoom,
			sw_lat: currentBoundingBox.sw_lat,
			sw_lng: currentBoundingBox.sw_lng,
			ne_lat: currentBoundingBox.ne_lat,
			ne_lng: currentBoundingBox.ne_lng,
		},
		100,
	);

	const reports = useReports({
		query: debouncedQuery,
	});

	const [reportsState, setReportsState] = useState<GetReportsResponse>();
	useEffect(() => {
		setIsFetchingReports(reports.isLoading);
	}, [reports.isLoading, setIsFetchingReports]);

	useEffect(() => {
		if (!reports.data) return;
		setReportsState(reports.data);
	}, [reports.data]);

	return (
		<div id="map-reports">
			{reportsState?.reports.map((x, index) => {
				return <ReportMarker key={x.id} report={x} />;
			})}
		</div>
	);
};
