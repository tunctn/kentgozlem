"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { GetReportsResponse } from "@/server/reports/get-reports";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapStore } from "./map-store";
import { Marker } from "./marker";

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

interface ReportMarkerProps {
	report: GetReportsResponse["reports"][number];
}
export const ReportMarker = ({ report }: ReportMarkerProps) => {
	const {
		//
		setExpandedReportMarkerId,
		expandedReportMarkerId,
		setMapReportDetailsDialogId,
	} = useMapStore();

	const [open, setOpen] = useState(false);

	const isExpanded = report.id === expandedReportMarkerId;

	// Close expanded marker when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const clickedMarker = target.closest("[data-marker-id]");

			if (!clickedMarker && expandedReportMarkerId) {
				setExpandedReportMarkerId(null);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [expandedReportMarkerId, setExpandedReportMarkerId]);

	return (
		<Marker
			lat={Number.parseFloat(report.latitude)}
			lng={Number.parseFloat(report.longitude)}
			className={cn("z-50 hover:z-60", {
				"z-60": isExpanded,
			})}
			interactive
			data-marker-id={report.id}
		>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setExpandedReportMarkerId(report.id);
				}}
				onDoubleClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setMapReportDetailsDialogId(report.id);
					setOpen(true);
				}}
			>
				<div
					className={cn(
						"group",
						"overflow-hidden",
						"relative rounded-[32px] shadow-md shadow-black/10 ring-2 ring-black/10 hover:ring-4 transition-all duration-300 ease-in-out active:scale-95",
						"h-[32px] w-[32px] flex items-center justify-center glass-looking",
						{
							"w-[220px] h-[120px] rounded-[16px] translate-y-[30px]": isExpanded,
						},
					)}
				>
					<div
						className={cn(
							"z-20 absolute text-black p-1.5 top-0 left-0 w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
							{
								"scale-90 !pointer-events-none": isExpanded,
							},
						)}
					>
						<div className="z-20 relative">
							<CircleAlert className="text-red-600" size={20} />
						</div>
					</div>
					<div
						className={cn("w-[220px] h-[120px] transition-all duration-300 ease-in-out", {
							"opacity-100": isExpanded,
							"opacity-0": !isExpanded,
						})}
					>
						test
					</div>

					<div
						className={cn(
							"pointer-events-none select-none bg-gradient-to-b from-white to-red-50 absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out",
							{
								"rounded-[16px]": isExpanded,
								"rounded-[32px]": !isExpanded,
							},
						)}
					/>
				</div>
			</button>

			{open && <MarkerDialog reportId={report.id} open={open} onOpenChange={setOpen} />}
		</Marker>
	);
};
