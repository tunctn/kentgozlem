import { animated, config, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import swap from "lodash-move";
import clamp from "lodash.clamp";
import { type ReactNode, useRef, useState } from "react";

interface DraggableHorizontalListProps {
	items: {
		id: string;
		render: (bindFn: ReturnType<typeof useDrag>) => ReactNode;
	}[];
	itemWidth?: number;
	canDrag?: boolean;
	onDragStart?: () => void;
	onDragEnd: (items: { id: string; order: number }[]) => void;
	dragButton?: ReactNode;
}

export const DraggableHorizontalList = ({
	items,
	itemWidth = 100,
	onDragStart,
	onDragEnd,
}: DraggableHorizontalListProps) => {
	const fn =
		(order: number[], active = false, originalIndex = 0, curIndex = 0, x = 0) =>
		(index: number) => {
			if (active && index === originalIndex) {
				return {
					x: curIndex * itemWidth + x,
					scale: 1.03,
					zIndex: 1,
					shadow: 15,
					immediate: (key: string) => key === "zIndex",
					config: (key: string) => (key === "x" ? config.stiff : config.default),
				};
			}

			return {
				x: order.indexOf(index) * itemWidth,
				scale: 1,
				zIndex: 0,
				shadow: 1,
				immediate: false,
			};
		};

	const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
	const [springs, api] = useSprings(items.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

	const [_active, setActive] = useState(false);

	const bind = useDrag(({ args: [originalIndex], active, movement: [x], distance: [dx, _dy] }) => {
		const isDragging = Math.abs(dx) > 5;

		if (active && isDragging && onDragStart) {
			onDragStart();
		}

		if (isDragging) {
			const curIndex = order.current.indexOf(originalIndex);
			const curRow = clamp(Math.round((curIndex * itemWidth + x) / itemWidth), 0, items.length - 1);
			const newOrder = swap(order.current, curIndex, curRow);
			api.start(fn(newOrder, active, originalIndex, curIndex, x));
			setActive(active);

			if (!active) {
				order.current = newOrder;
				const mappedOrder = order.current.map((index) => ({
					id: items[index]?.id ?? "",
					order: index,
				}));
				onDragEnd(mappedOrder);
			}
		}
	});

	return (
		<div className="relative w-full " style={{ width: items.length * itemWidth }}>
			{springs.map(({ zIndex, x, scale }, i) => (
				<animated.div
					key={items[i]?.id}
					className={"absolute w-full"}
					style={{
						width: itemWidth,
						transformOrigin: "50% 50% 0px",
						zIndex,
						x,
						scale,
					}}
				>
					<div className="relative flex h-full w-full items-center">
						<div className="h-full w-full">{items[i]?.render(bind(i))}</div>
					</div>
				</animated.div>
			))}
		</div>
	);
};
