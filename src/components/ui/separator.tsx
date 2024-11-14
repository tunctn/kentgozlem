"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "@/lib/utils";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
	text?: string;
}

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	SeparatorProps
>(({ className, orientation = "horizontal", decorative = true, text, ...props }, ref) => {
	const hasText = !!text;
	return (
		<div
			className={cn(
				"flex items-center",
				{
					"w-full": orientation === "horizontal",
					"h-full": orientation === "vertical",
					"gap-3": hasText,
				},
				className,
			)}
		>
			<SeparatorPrimitive.Root
				ref={ref}
				decorative={decorative}
				orientation={orientation}
				className={cn("shrink-0 bg-foreground/10", {
					"h-[1px]": orientation === "horizontal",
					"w-full": !hasText && orientation === "horizontal",

					"w-[1px]": orientation === "vertical",
					"h-full": !hasText && orientation === "vertical",

					grow: hasText && orientation === "horizontal",
				})}
				{...props}
			/>
			{hasText && (
				<span className="text-xs text-muted-foreground/50 whitespace-nowrap select-none ">
					{text}
				</span>
			)}
			<SeparatorPrimitive.Root
				ref={ref}
				decorative={decorative}
				orientation={orientation}
				className={cn("shrink-0 bg-foreground/10", {
					"h-[1px]": orientation === "horizontal",
					"w-full": !hasText && orientation === "horizontal",

					"w-[1px]": orientation === "vertical",
					"h-full": !hasText && orientation === "vertical",

					hidden: !hasText,
					grow: hasText,
				})}
				{...props}
			/>
		</div>
	);
});
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
