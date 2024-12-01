"use client";
import { Mapbox } from "@/app/components/mapbox";
import type { InitialMapConfig } from "@/utils/get-initial-map-config";

export default function AuthLayoutMap({
	isSmallDevice,
	initialMapConfig,
}: { isSmallDevice: boolean; initialMapConfig: InitialMapConfig }) {
	if (isSmallDevice) return null;
	return (
		<div className="absolute inset-0 left-0 top-0 w-full h-full">
			<Mapbox authMap initialConfig={initialMapConfig} />
		</div>
	);
}
