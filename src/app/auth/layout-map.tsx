"use client";
import { Mapbox } from "@/app/components/mapbox";

export default function AuthLayoutMap({ isSmallDevice }: { isSmallDevice: boolean }) {
	if (isSmallDevice) return null;
	return (
		<div className="absolute inset-0 left-0 top-0 w-full h-full">
			<Mapbox authMap />
		</div>
	);
}
