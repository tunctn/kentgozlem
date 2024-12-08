"use client";

import { LoadingDotsBouncing } from "@/components/ui/loading-dots-bouncing";
import { cn } from "@/lib/utils";
import { useMapStore } from "./map-store";

export const FetchingReportsIndicator = () => {
	const isFetchingReports = useMapStore().isFetchingReports;
	return (
		<div
			className={cn(
				"glass-looking rounded-lg px-5 py-3 transition-all duration-300 translate-y-3",
				{
					"opacity-0 translate-y-0": !isFetchingReports,
				},
			)}
		>
			<LoadingDotsBouncing size={6} />
		</div>
	);
};
