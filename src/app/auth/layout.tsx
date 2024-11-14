"use client";
import { Mapbox } from "../components/mapbox";

import LogoOnMap from "@/components/logo";
import { cn } from "@/lib/utils";
import { useMapStore } from "../components/map-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const { loaded } = useMapStore();

	return (
		<div
			className={cn(
				"h-[100dvh] flex items-center justify-center transition-opacity",
				loaded ? "opacity-100 delay-500" : "opacity-0",
			)}
		>
			<LogoOnMap className="absolute top-2 left-1/2 -translate-x-1/2 -ml-1" />

			<div className="w-full max-w-sm z-10 shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-md">
				<div
					className={cn(
						"p-6 bg-background/70 dark:bg-background/60 border border-background/30 backdrop-blur-2xl rounded-[inherit]",
					)}
				>
					{children}
				</div>
			</div>

			<div className="absolute inset-0 left-0 top-0 w-full h-full">
				<Mapbox authMap />
			</div>
		</div>
	);
}
