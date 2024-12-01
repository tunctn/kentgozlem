"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";
import { useWindowSize } from "./use-window-size";

interface ElementDimensions {
	width: number;
	height: number;
}
const defaultState: ElementDimensions = {
	width: 0,
	height: 0,
};

interface UseElementDimensionsProps {
	element: HTMLElement | string | RefObject<HTMLElement> | null;
	throttle?: number;
	callback?: (dimensions: ElementDimensions) => void;
	deps?: React.DependencyList;
}
export const useElementDimensions = ({
	element,
	throttle = 100,
	callback,
	deps = [],
}: UseElementDimensionsProps): ElementDimensions => {
	// State
	const [elementDimensions, setElementDimensions] = useState<ElementDimensions>(defaultState);

	// Get window size
	const windowSize = useWindowSize({ throttle });
	const windowSizeString = JSON.stringify(windowSize);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Because we need to re-run the function when windowSize changes>
	useEffect(() => {
		if (!element) return;
		let el: HTMLElement | null = null;

		// Get element from id or element itself
		if (typeof element === "string") el = document.getElementById(element);
		else if (element instanceof HTMLElement) el = element;
		else el = element.current;

		// If element is not found, return default state
		if (!element || el === null) {
			setElementDimensions(defaultState);
			return;
		}

		// Set element size
		setElementDimensions({
			width: el.offsetWidth,
			height: el.offsetHeight,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [windowSizeString, element, ...deps]);

	// Callback
	const memoizedCallback = useCallback(
		(elementDimensions: ElementDimensions) => {
			if (callback) callback(elementDimensions);
		},
		[callback],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Because we need to re-run the function when elementDimensions changes>
	useEffect(() => {
		memoizedCallback(elementDimensions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [elementDimensions]);

	return elementDimensions;
};
