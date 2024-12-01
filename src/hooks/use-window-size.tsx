"use client";

import { useEffect, useState } from "react";

interface UseWindowSizeProps {
	throttle: number;
}
export const useWindowSize = ({ throttle = 100 }: UseWindowSizeProps) => {
	const [windowSize, setWindowSize] = useState<{
		width: number | undefined;
		height: number | undefined;
	}>({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		let timeoutId: undefined | ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}, throttle);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [throttle]);

	return windowSize;
};
