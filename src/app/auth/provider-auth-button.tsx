import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLocationOrigin } from "../hooks/use-location-origin";

export function ProviderAuthButton({
	provider,
	className,
	children,
	...props
}: {
	provider?: "google" | "login-with-email" | "sign-up-with-email";
	children: ReactNode;
} & ButtonProps) {
	const origin = useLocationOrigin();

	if (provider === "login-with-email") {
		return (
			<Button className={cn("shadow-none text-xs", className)} variant="link" asChild {...props}>
				<Link href="/auth/sign-in/email">{children}</Link>
			</Button>
		);
	}
	if (provider === "sign-up-with-email") {
		return (
			<Button className={cn("shadow-none text-xs", className)} variant="link" asChild {...props}>
				<Link href="/auth/sign-up">{children}</Link>
			</Button>
		);
	}

	return (
		<Button className={cn("text-xs", className)} asChild {...props}>
			<a href={`/api/auth/oauth/${provider}?redirect_url=${origin}`}>{children}</a>
		</Button>
	);
}
