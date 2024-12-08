import { cn } from "@/lib/utils";

interface MapPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	position:
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
}
export default function MapPanel({ position, className, ...props }: MapPanelProps) {
	return (
		<div
			className={cn(
				"absolute w-max h-max z-10",
				{
					"left-3 top-3": position === "top-left",
					"left-1/2 -translate-x-1/2 top-0": position === "top-center",
					"right-3 top-3": position === "top-right",
					"left-3 bottom-3": position === "bottom-left",
					"left-1/2 -translate-x-1/2 bottom-0": position === "bottom-center",
					"right-3 bottom-3": position === "bottom-right",
				},
				className,
			)}
			{...props}
		/>
	);
}
