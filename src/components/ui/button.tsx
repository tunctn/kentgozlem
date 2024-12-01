"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { useElementDimensions } from "@/hooks/use-element-dimensions";
import { cn } from "@/lib/utils";
import { LoadingDotsBouncing } from "./loading-dots-bouncing";

const buttonVariants = cva(
	cn(
		"cursor-pointer",
		"shadow-lg shadow-black/20", // Shadow
		"inline-flex items-center justify-center gap-2", // Flexbox and spacing
		"font-semibold text-sm", // Typography
		"whitespace-nowrap rounded-md", // Layout and border radius
		"transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring", // Transition and focus styles
		"disabled:pointer-events-none disabled:opacity-50", // Disabled state
		"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", // SVG specific styles
	),
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
				outline: "border border-foreground/10 bg-transparent shadow-xs hover:bg-primary/10",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				glass: "glass-looking hover:bg-background/80 dark:hover:bg-background/20",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",

				"2xs-icon": "h-6 w-6 rounded-sm",
				"xs-icon": "h-7 w-7 rounded-sm",
				"sm-icon": "h-8 w-8",
				icon: "h-9 w-9",
				"lg-icon": "h-10 w-10",
				"xl-icon": "h-11 w-11",
			},
			grouped: {
				true: "!bg-transparent backdrop-blur-none border-0 hover:!bg-background/80 dark:hover:!bg-foreground/5 shadow-none inset-shadow-none inset-ring-0 ring-0",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			grouped: false,
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
	isDisabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			grouped,
			isLoading,
			isDisabled,
			asChild = false,
			children,
			style,
			...props
		},
		forwardedRef,
	) => {
		const Comp = asChild ? Slot : "button";
		const ref = React.useRef<HTMLButtonElement>(null);
		React.useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement);

		const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
		const { width, height } = dimensions;

		useElementDimensions({
			element: ref.current,
			callback: (x) => {
				if (isLoading) return;
				setDimensions(x);
			},
		});

		// Immediately set dimensions if they are not set
		React.useEffect(() => {
			if (!ref.current) return;
			if (dimensions.width !== 0 && dimensions.height !== 0) return;

			const elDimensions = ref.current?.getBoundingClientRect();
			if (elDimensions) setDimensions(elDimensions);
		}, [dimensions.width, dimensions.height]);

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, grouped, className }))}
				ref={ref}
				style={{
					...style,
					width: isLoading ? width : undefined,
					height: isLoading ? height : undefined,
				}}
				{...props}
			>
				{isLoading ? <LoadingDotsBouncing size={4} /> : children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
