import { animated, config, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import swap from "lodash-move";
import clamp from "lodash.clamp";
import { type ReactNode, useRef, useState } from "react";

interface DraggableListProps {
	items: {
		id: string;
		render: (bindFn: ReturnType<typeof useDrag>) => ReactNode;
	}[];
	itemHeight?: number;
	canDrag?: boolean;
	onDragEnd: (items: { id: string; order: number }[]) => void;
	dragButton?: ReactNode;
}

export const DraggableList = ({ items, itemHeight = 100, onDragEnd }: DraggableListProps) => {
	const fn =
		(order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
		(index: number) => {
			if (active && index === originalIndex) {
				return {
					y: curIndex * itemHeight + y,
					scale: 1.03,
					zIndex: 1,
					shadow: 15,
					immediate: (key: string) => key === "zIndex",
					config: (key: string) => (key === "y" ? config.stiff : config.default),
				};
			}

			return {
				y: order.indexOf(index) * itemHeight,
				scale: 1,
				zIndex: 0,
				shadow: 1,
				immediate: false,
			};
		};

	const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
	const [springs, api] = useSprings(items.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

	const [_active, setActive] = useState(false);

	const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
		const curIndex = order.current.indexOf(originalIndex);
		const curRow = clamp(Math.round((curIndex * itemHeight + y) / itemHeight), 0, items.length - 1);
		const newOrder = swap(order.current, curIndex, curRow);
		api.start(fn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
		setActive(active);
		if (!active) {
			order.current = newOrder;
			const mappedOrder = order.current.map((index) => ({
				id: items[index]?.id ?? "",
				order: index,
			}));
			onDragEnd(mappedOrder);
		}
	});

	return (
		<div className="relative w-full " style={{ height: items.length * itemHeight }}>
			{springs.map(({ zIndex, y, scale }, i) => (
				<animated.div
					key={items[i]?.id}
					className={"absolute w-full"}
					style={{
						height: itemHeight,
						transformOrigin: "50% 50% 0px",
						zIndex,
						y,
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
