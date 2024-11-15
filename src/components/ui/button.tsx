import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"shadow-lg shadow-black/20 inline-flex font-semibold items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline: "border border-foreground/10 bg-transparent shadow-sm hover:bg-primary/10",
				secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				glass: "bg-background/60 backdrop-blur-lg text-primary-background hover:bg-background/80",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				"xs-icon": "h-6 w-6",
				"sm-icon": "h-8 w-8",
				icon: "h-9 w-9",
				"lg-icon": "h-10 w-10",
				"xl-icon": "h-11 w-11",
			},
			grouped: {
				true: "bg-transparent backdrop-blur-none border-none hover:bg-foreground/40 shadow-none",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, grouped, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, grouped, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
