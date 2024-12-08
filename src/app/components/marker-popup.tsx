"use client";

import type { GetReportsResponse } from "@/server/reports/get-reports";
import { memo } from "react";
import { useMapStore } from "../components/map-store";

export const PopupContent = memo(
	({ reportId }: { reportId: GetReportsResponse["reports"][number]["id"] }) => {
		const { setMapReportPopupId, setMapReportDetailsDialogId } = useMapStore();
		return (
			<div
				data-marker-id={reportId}
				className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-lg pointer-events-auto "
			>
				{reportId}
				{/* <p>Longitude: {report.longitude}</p>
				<p>Latitude: {report.latitude}</p>
				<button
					type="button"
					onClick={() => {
						setMapReportPopupId(null);
						setMapReportDetailsDialogId(report.id);
					}}
				>
					Detaylar
				</button> */}
			</div>
		);
	},
);

// Add display name for better debugging
PopupContent.displayName = "PopupContent";
