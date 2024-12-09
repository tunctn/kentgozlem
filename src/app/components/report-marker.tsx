"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { GetReportsResponse } from "@/server/reports/get-reports";
import { ChevronRight, CircleAlert, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useMapStore } from "./map-store";
import { Marker } from "./marker";
import { useReportMarkerStore } from "./report-marker-store";

interface MarkerDialogProps {
	reportId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
const MarkerDialog = ({ reportId, open, onOpenChange }: MarkerDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="z-100" overlayProps={{ className: "z-90" }}>
				<DialogHeader>
					<DialogTitle>Detaylar</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

const ExpandedLabelValue = ({ label, value }: { label: ReactNode; value: ReactNode }) => {
	return (
		<div className="text-left text-black">
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="text-sm font-medium">{value}</div>
		</div>
	);
};

interface ReportMarkerProps {
	report: GetReportsResponse["reports"][number];
}
export const ReportMarker = ({ report }: ReportMarkerProps) => {
	const { setExpandedReportMarkerId, expandedReportMarkerId } = useReportMarkerStore();
	const { setMapReportDetailsDialogId } = useMapStore();
	const [open, setOpen] = useState(false);
	const isExpanded = report.id === expandedReportMarkerId;

	// Close the expanded marker when clicking outside of it
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
			className={cn("z-50", {
				"z-60": isExpanded,
			})}
			interactive
		>
			<div
				className="relative shadow-md shadow-black/10 ring-2 ring-black/10 hover:ring-4 transition-all ease-in-out"
				data-marker-id={report.id}
				data-interactive={isExpanded ? "true" : "false"}
			>
				<button
					type="button"
					className={cn("absolute top-0 left-0 z-[1000] h-full w-full", {
						"opacity-0 pointer-events-none select-none": isExpanded,
					})}
					data-interactive="true"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setExpandedReportMarkerId(report.id);
					}}
					title="Detaylara bak"
				>
					<div className="h-[32px] w-[32px]" />
				</button>

				<div
					className={cn(
						"absolute top-0 left-1/2 ",
						"group",
						"overflow-hidden",
						"rounded-[32px]  transition-all ease-in-out active:scale-95",
						"h-[32px] w-[32px] flex ",
						{
							"w-[220px] h-[220px] rounded-[16px] duration-600 -translate-x-[30px]": isExpanded,
							"duration-300": !isExpanded,
						},
					)}
				>
					<div
						className={cn(
							"z-20 absolute  text-black p-1.5 top-0 left-0 w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ease-in-out duration-300",
							{ "scale-80 !pointer-events-none translate-x-[4px]": isExpanded },
						)}
					>
						<div
							className={cn("z-20 relative text-rose-600 dark:text-white", {
								"dark:text-rose-600": isExpanded,
							})}
						>
							<CircleAlert size={20} />
						</div>
					</div>

					<button
						className={cn(
							"z-110 absolute text-black p-1.5 top-0 right-0 w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ease-in-out duration-300",
							{ "scale-80": isExpanded },
							{ "opacity-0 pointer-events-none": !isExpanded },
						)}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setExpandedReportMarkerId(null);
						}}
					>
						<div className="z-20 relative text-black/50">
							<X size={20} />
						</div>
					</button>
					<div
						className={cn(
							"relative z-100 h-[220px] w-[220px] px-3 transition-all flex flex-col pb-3 justify-between duration-500 ease-in-out select-text",
							{
								"opacity-100 duration-500 !cursor-auto": isExpanded,
								"opacity-0 duration-100": !isExpanded,
							},
						)}
					>
						<div className="flex flex-col gap-1 pt-8 overflow-hidden whitespace-nowrap w-[220px] h-[120px]">
							<ExpandedLabelValue label="Kategori" value={report.category_name} />
							<ExpandedLabelValue label="Durum" value={report.status} />
						</div>

						<button
							type="button"
							onClick={() => {
								setOpen(true);
							}}
							className="bg-white text-black rounded-md font-medium w-full flex items-center justify-center gap-1 border border-black/10 py-1 hover:bg-black/1 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
						>
							Detaylara bak <ChevronRight size={13} className="mt-0.5" />
						</button>
					</div>

					<div
						className={cn(
							"pointer-events-none select-none bg-gradient-to-b from-white to-red-50 absolute top-0 z-10 left-0 w-full h-full transition-all duration-500 ease-in-out-quintic",
							"dark:from-rose-500 dark:to-rose-600",
						)}
					/>
					<div
						className={cn(
							"absolute opacity-0 top-0 z-[11] left-0 w-full h-full bg-white transition-all duration-200 ease-in-out",
							{ "opacity-100": isExpanded },
							{ "duration-300 delay-100": !isExpanded },
						)}
					/>
				</div>
			</div>

			<MarkerDialog
				reportId={report.id}
				open={open}
				onOpenChange={(open) => {
					setOpen(open);
					setTimeout(() => {
						setExpandedReportMarkerId(report.id);
					}, 0);
				}}
			/>
		</Marker>
	);
};
