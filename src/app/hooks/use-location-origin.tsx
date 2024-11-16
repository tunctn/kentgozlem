"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useLocationOrigin = () => {
	const pathname = usePathname();
	const [origin, setOrigin] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Because we need to re-run the function when pathname changes>
	useEffect(() => {
		if (typeof window !== "undefined") {
			setOrigin(window.location.origin);
		}
	}, [pathname]);

	return origin;
};
