import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import { useMapStore } from "./map-store";

interface CompassProps {
	degree: number;
}

const calculateAngle = (rect: DOMRect, clientX: number, clientY: number) => {
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	// Calculate angle between center and pointer
	const angle = Math.atan2(clientY - centerY, clientX - centerX);
	return ((angle * 180) / Math.PI + 90) % 360;
};

export const Compass = ({ degree }: CompassProps) => {
	const { map, isDraggingCompass, setIsDraggingCompass } = useMapStore();
	const compassRef = useRef<HTMLButtonElement>(null);
	const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
	const initialBearing = useRef<number>(0);

	const onClick = () => {
		if (!map) return;
		if (isDraggingCompass) return;
		map.easeTo({ bearing: 0 });
	};

	const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
		const coords =
			"touches" in e
				? { x: e.touches[0].clientX, y: e.touches[0].clientY }
				: { x: e.clientX, y: e.clientY };

		dragStartPosition.current = coords;
		initialBearing.current = map?.getBearing() ?? 0;
		setIsDraggingCompass(true);
		e.preventDefault();
	};

	const handleDragEnd = useCallback(() => {
		dragStartPosition.current = null;
		setTimeout(() => {
			setIsDraggingCompass(false);
		}, 50);
	}, [setIsDraggingCompass]);

	useEffect(() => {
		let animationFrameId: number;

		// Extract client coordinates from mouse or touch event
		const getClientCoordinates = (e: MouseEvent | TouchEvent) => {
			const isTouchEvent = "touches" in e;
			return {
				x: isTouchEvent ? e.touches[0].clientX : e.clientX,
				y: isTouchEvent ? e.touches[0].clientY : e.clientY,
			};
		};

		// Update map bearing based on pointer position
		const updateMapBearing = (clientX: number, clientY: number) => {
			const rect = compassRef.current?.getBoundingClientRect();
			if (!rect || !dragStartPosition.current) return;

			// Calculate the initial angle
			const startAngle = calculateAngle(
				rect,
				dragStartPosition.current.x,
				dragStartPosition.current.y,
			);
			// Calculate the current angle
			const currentAngle = calculateAngle(rect, clientX, clientY);
			// Calculate the difference
			const angleDiff = currentAngle - startAngle;

			// Apply the difference to the initial bearing
			map.jumpTo({ bearing: initialBearing.current - angleDiff });
		};

		// Handle drag with animation frame optimization
		// Otherwise it gives a jittery effect & render stack exceeded error
		const handleDrag = (e: MouseEvent | TouchEvent) => {
			if (!isDraggingCompass || !dragStartPosition.current) return;

			const { x, y } = getClientCoordinates(e);

			if (animationFrameId) cancelAnimationFrame(animationFrameId);

			animationFrameId = requestAnimationFrame(() => {
				updateMapBearing(x, y);
			});
		};

		// Add event listeners when compass is being dragged
		if (isDraggingCompass) {
			window.addEventListener("mousemove", handleDrag);
			window.addEventListener("touchmove", handleDrag);
			window.addEventListener("mouseup", handleDragEnd);
			window.addEventListener("touchend", handleDragEnd);
		}

		// Cleanup function
		return () => {
			window.removeEventListener("mousemove", handleDrag);
			window.removeEventListener("touchmove", handleDrag);
			window.removeEventListener("mouseup", handleDragEnd);
			window.removeEventListener("touchend", handleDragEnd);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, [isDraggingCompass, handleDragEnd, map]);

	const direction = (() => {
		if (degree >= -45 && degree <= 45) return "K";
		if (degree > 45 && degree <= 135) return "D";
		if (degree > 135 && degree <= 180) return "G";
		if (degree < -135 && degree >= -180) return "G";
		return "B";
	})();

	return (
		<button
			ref={compassRef}
			type="button"
			onClick={onClick}
			className="relative rounded-full bg-background/[73%] backdrop-blur-lg w-[50px] h-[50px]"
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 48 48"
				fill="none"
				className={cn("will-change-transform absolute top-0 left-0 cursor-grab", {
					"cursor-grabbing": isDraggingCompass,
				})}
				xmlns="http://www.w3.org/2000/svg"
				style={{ transform: `rotate(${-degree}deg)` }}
				onMouseDown={handleDragStart}
				onTouchStart={handleDragStart}
			>
				<title>Compass</title>
				<circle cx="23.9937" cy="24" r="24" fill="transparent" />

				{/* North Cardinal Direction  */}
				<path
					d="M21.2105 7.62055L23.2079 3.95861C23.5472 3.33662 24.4403 3.33662 24.7796 3.95861L26.777 7.62055C27.0044 8.03742 26.6354 8.56684 26.1621 8.5285C25.6228 8.48482 24.9 8.44812 23.9937 8.44812C23.0874 8.44812 22.3647 8.48482 21.8254 8.5285C21.3521 8.56684 20.9831 8.03742 21.2105 7.62055Z"
					fill="#ED5743"
				/>
				{/* Cardinal Direction Ticks */}
				{Array.from({ length: 16 }).map((_, i) => {
					const isFirst = i === 8;
					if (isFirst) return null;

					const isDirection = i === 0 || i === 8 || i === 12 || i === 4;

					return (
						<path
							key={i.toString()}
							x="23"
							y="4"
							width="2"
							d="M25.1504 40.0366L24.4865 43.9203C24.3918 44.4746 23.5956 44.4746 23.5008 43.9203L22.837 40.0366C22.7786 39.6949 23.0418 39.3829 23.3884 39.3829L24.5989 39.3829C24.9456 39.3829 25.2088 39.6949 25.1504 40.0366Z"
							height="4"
							fill="#B2B4B9"
							transform={`rotate(${(i * 360) / 16} 24 24)`}
							fillOpacity={isDirection ? 1 : 0.4}
						/>
					);
				})}
			</svg>

			<CompassDirection direction={"K"} currentDirection={direction} />
			<CompassDirection direction={"G"} currentDirection={direction} />
			<CompassDirection direction={"D"} currentDirection={direction} />
			<CompassDirection direction={"B"} currentDirection={direction} />
		</button>
	);
};

const CompassDirection = ({
	direction,
	currentDirection,
}: { direction: string; currentDirection: string }) => {
	return (
		<div
			className={cn(
				"absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[18px] font-semibold opacity-0 transition-opacity duration-200 select-none",
				{
					"opacity-100": direction === currentDirection,
				},
			)}
		>
			{direction}
		</div>
	);
};
