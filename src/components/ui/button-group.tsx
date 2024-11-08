import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";

export interface ButtonGroupProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof buttonVariants> {}

export const ButtonGroup = ({ children, variant, className }: ButtonGroupProps) => {
	return (
		<div
			className={buttonVariants({
				variant,
				className: cn(
					"rounded-lg flex items-center h-auto w-auto !p-0.5 !m-0 !gap-0 ",
					{
						"hover:bg-primary": variant === "default",
						"hover:bg-destructive": variant === "destructive",
						"hover:bg-none": variant === "outline",
						"hover:bg-secondary": variant === "secondary",
						"hover:bg-foreground/60": variant === "glass",
					},
					className,
				),
			})}
		>
			{children}
		</div>
	);
};
