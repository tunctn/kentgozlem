import { Button, type ButtonProps } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export function ProviderAuthButton({
	provider,
	className,
	children,
	...props
}: {
	provider?: "google" | "login-with-email" | "sign-up-with-email";
	children: ReactNode;
} & ButtonProps) {
	if (provider === "login-with-email") {
		return (
			<Button className={cn("shadow-none ", className)} size="lg" variant="link" asChild {...props}>
				<Link href="/auth/sign-in/email">{children}</Link>
			</Button>
		);
	}
	if (provider === "sign-up-with-email") {
		return (
			<Button className={cn("shadow-none", className)} size="lg" variant="link" asChild {...props}>
				<Link href="/auth/sign-up">{children}</Link>
			</Button>
		);
	}

	return (
		<form
			action={async () => {
				"use server";
				await signIn(provider);
			}}
		>
			<Button className={cn(className)} size="lg" {...props}>
				{children}
			</Button>
		</form>
	);
}
