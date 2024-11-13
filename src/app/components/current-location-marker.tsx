import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { useMapStore } from "./map-store";

export const CurrentLocationMarker = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>((_props, ref) => {
	const { viewState } = useMapStore();

	const zoomThreshold = 15;
	const tooClose = viewState.zoom > zoomThreshold;

	const scaleFactor = 2 ** (viewState.zoom - zoomThreshold) * 2;

	const [transitioning, setTransitioning] = useState(false);
	const isAtTransitionPoint = scaleFactor > 1.5 && scaleFactor < 2.5;

	const size = (() => {
		const baseSize = 24 * scaleFactor;
		if (tooClose) return baseSize > 24 ? baseSize : 24;
		return 24;
	})();

	useEffect(() => {
		if (isAtTransitionPoint) {
			setTransitioning(true);
			return;
		}

		const timeout = setTimeout(() => {
			setTransitioning(false);
		}, 500);

		return () => clearTimeout(timeout);
	}, [isAtTransitionPoint]);

	return (
		<div className="relative flex items-center justify-center rounded-full" ref={ref}>
			<div
				className={cn({
					"transition-all duration-500 ease-in-out will-change-auto": transitioning,
				})}
				style={{
					width: `${size}px`,
					height: `${size}px`,
				}}
			>
				<div
					className={cn(
						"relative w-full h-full rounded-full  shadow-xl flex items-center justify-center",
						{
							"shadow-black/0": tooClose,
							"bg-neutral-50 shadow-black/40": !tooClose,
						},
					)}
				>
					<div className="w-3/4 h-3/4 rounded-full ">
						<div
							className={cn("w-full h-full rounded-full bg-blue-500", {
								"bg-blue-500/30 ring-[5px] ring-neutral-50": tooClose,
							})}
							style={{
								animation: !tooClose ? "scale-pulse 3s ease-in-out infinite" : undefined,
							}}
						/>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes scale-pulse {
					0%, 20%, 80%, 100% { transform: scale(1.1); }
					50% { transform: scale(0.9); }
				}
			`}</style>
		</div>
	);
});
