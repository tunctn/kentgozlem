"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { oauthErrors } from "../config/oauth-errors";

const removeErrorQueryParam = (pathname: string, searchParams: URLSearchParams) => {
	const url = new URL(`${window.location.origin}${pathname}`);
	searchParams.forEach((value, key) => {
		url.searchParams.set(key, value);
	});
	url.searchParams.delete("error");
	return url.toString();
};

export function OAuthMessageToasts() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	useEffect(() => {
		if (!error) return;

		const timeout = setTimeout(() => {
			const errorMessage = oauthErrors[error as keyof typeof oauthErrors];
			toast.error(errorMessage);
			const newPathname = removeErrorQueryParam(pathname, searchParams);
			router.replace(newPathname);
		}, 1);

		return () => clearTimeout(timeout);
	}, [error, pathname, router, searchParams]);

	return <></>;
}
