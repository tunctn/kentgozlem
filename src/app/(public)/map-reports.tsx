"use client";

import { useReports } from "@/lib/api/use-reports";
import type { GetReportsQuery } from "@/server/reports/get-reports";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useMapStore } from "../components/map-store";

export const MapReports = () => {
	const { viewState } = useMapStore();
	const [query, setQuery] = useState<GetReportsQuery | null>(null);

	// Move debounced function outside useEffect
	const debouncedUpdateQuery = useCallback(
		debounce((newViewState: typeof viewState) => {
			if (!newViewState) return;

			const query: GetReportsQuery = {
				lat: newViewState.center[1],
				lng: newViewState.center[0],
				zoom: newViewState.zoom,
			};
			setQuery(query);
		}, 200),
		[],
	);

	useEffect(() => {
		debouncedUpdateQuery(viewState);

		return () => {
			debouncedUpdateQuery.cancel();
		};
	}, [viewState, debouncedUpdateQuery]);

	const reports = useReports({
		query: query,
	});

	return <div />;
};
