"use client";

import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import type { InitialMapConfig } from "@/utils/get-initial-map-config";
import { useMapStore } from "../components/map-store";
import { useMediaQuery } from "../hooks/use-media-query";
import AuthLayoutMap from "./layout-map";
import { OAuthMessageToasts } from "./oauth-message-toasts";

interface AuthLayoutWrapperProps {
	children: React.ReactNode;
	initialMapConfig: InitialMapConfig;
}

export default function AuthLayoutWrapper({ children, initialMapConfig }: AuthLayoutWrapperProps) {
	const { loaded } = useMapStore();
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

	return (
		<div
			className={cn(
				"h-[100dvh] flex flex-col md:flex-row pt-5 md:pt-0 items-center md:justify-center transition-opacity",
				{
					"opacity-100 delay-500": loaded,
					"opacity-0": !loaded && !isSmallDevice,
				},
			)}
		>
			<OAuthMessageToasts />
			<Logo
				className="md:absolute md:top-2 md:left-1/2 md:-translate-x-1/2 md:-ml-1 "
				theme={initialMapConfig.theme}
			/>

			<div className="w-full mt-10 md:mt-0 max-w-md md:max-w-sm z-10 md:h-auto rounded-md">
				<div className={cn("p-6 glass-looking rounded-[inherit]")}>{children}</div>
			</div>

			<AuthLayoutMap isSmallDevice={isSmallDevice} initialMapConfig={initialMapConfig} />
		</div>
	);
}
