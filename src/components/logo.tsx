import { cn } from "@/lib/utils";
import { getTheme } from "@/utils/get-theme";
import { Manrope } from "next/font/google";
import Image from "next/image";
import type { ComponentPropsWithRef } from "react";

const font = Manrope({ subsets: ["latin"] });

interface LogoProps extends ComponentPropsWithRef<"a"> {
	forcedTheme?: "light" | "dark";
}

export default function Logo({ className, forcedTheme, ...props }: LogoProps) {
	const { theme } = getTheme();
	const isLight = forcedTheme ? forcedTheme === "light" : theme === "light";

	return (
		<a
			href="/"
			className={cn(
				"z-10 flex items-center gap-2 scale-[85%] md:scale-100 origin-top-left",
				className,
			)}
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
