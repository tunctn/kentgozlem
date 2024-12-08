"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { GetReportsResponse } from "@/server/reports/get-reports";
import { CircleAlert } from "lucide-react";
import { memo, useState } from "react";

interface MarkerDialogProps {
	reportId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
const MarkerDialog = ({ reportId, open, onOpenChange }: MarkerDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Detaylar</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export const Marker = memo(({ report }: { report: GetReportsResponse["reports"][number] }) => {
	// const { setMapReportPopupId, setMapReportDetailsDialogId, mapMarkers } = useMapStore();
	const [open, setOpen] = useState(false);

	// const handleClick = useCallback(() => {
	// 	const marker = mapMarkers.get(report.id);
	// 	if (!marker) return;
	// 	marker.togglePopup();
	// }, [mapMarkers, report.id]);

	return (
		<div
			className="relative group"
			// data-marker-id={report.id}
			// onMouseDown={(e) => {
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// }}
		>
			<button
				type="button"
				className="p-1.5 relative bg-red-500 text-black rounded-full shadow-md shadow-black/10 ring-2 ring-black/10 hover:ring-4 transition-all duration-150 active:scale-95"
				// onClick={(e) => {
				// 	e.stopPropagation();
				// 	handleClick();
				// 	// setMapReportPopupId(report.id);
				// }}
				// onDoubleClick={(e) => {
				// 	e.preventDefault();
				// 	e.stopPropagation();
				// 	setMapReportPopupId(null);
				// 	setMapReportDetailsDialogId(report.id);

				// 	setOpen(true);
				// }}
			>
				<div className="z-10 relative">
					<CircleAlert className="text-red-600" size={20} />
				</div>
				<div className="pointer-events-none select-none bg-gradient-to-b from-white to-white/90 absolute top-0 left-0 w-full h-full rounded-full" />
			</button>

			{/* <MarkerDialog reportId={report.id} open={open} onOpenChange={setOpen} /> */}
		</div>
	);
});

Marker.displayName = "Marker";
