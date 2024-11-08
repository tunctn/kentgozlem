"use client";

import { useEffect } from "react";
import { useMapStore } from "./map-store";

export default function MapLayout({ children }: { children: React.ReactNode }) {
	const { isDraggingCompass } = useMapStore();

	useEffect(() => {
		// Change cursor when dragging compass
		if (isDraggingCompass) {
			document.body.classList.add("grabbing");
		} else {
			document.body.classList.remove("grabbing");
		}
	}, [isDraggingCompass]);

	return <div className="h-full w-full">{children}</div>;
}
