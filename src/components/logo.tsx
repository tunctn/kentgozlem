import { useMapStore } from "@/app/components/map-store";
import { cn } from "@/lib/utils";
import { Manrope } from "next/font/google";
import Image from "next/image";
import type { ComponentPropsWithRef } from "react";

const font = Manrope({ subsets: ["latin"] });

interface LogoOnMapProps extends ComponentPropsWithRef<"a"> {}

export default function LogoOnMap({ className, ...props }: LogoOnMapProps) {
	const lightPreset = useMapStore.getState().lightPreset;
	const isLight = lightPreset === "day" || lightPreset === "dawn";

	return (
		<a
			href="/"
			className={cn("z-10 mb-8 flex items-center gap-2 absolute left-0 top-0", className)}
			{...props}
		>
			<Image
				src={isLight ? "/kentgozlem_512w.png" : "/kentgozlem_bgless_512w.png"}
				alt="Kent Gözlem"
				width={isLight ? 35 : 42}
				height={isLight ? 35 : 42}
			/>
			<span className={cn("text-xl font-black text-foreground select-none", font.className)}>
				kent gözlem
			</span>
		</a>
	);
}
