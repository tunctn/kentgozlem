import type { Theme } from "@/app/components/theme-store";
import { cn } from "@/lib/utils";
import { Manrope } from "next/font/google";
import Image from "next/image";
import type { ComponentPropsWithRef } from "react";

const font = Manrope({ subsets: ["latin"] });

interface LogoProps extends ComponentPropsWithRef<"a"> {
	theme: Theme;
}

const LightLogo = () => {
	return <Image src={"/kentgozlem_512w.png"} alt="Kent Gözlem" width={35} height={35} />;
};

const DarkLogo = () => {
	return <Image src={"/kentgozlem_bgless_512w.png"} alt="Kent Gözlem" width={35} height={35} />;
};

export default function Logo({ className, theme, ...props }: LogoProps) {
	return (
		<a
			href="/"
			className={cn(
				"z-10 flex items-center gap-2 scale-[85%] md:scale-100 origin-top-left",
				className,
			)}
			{...props}
			suppressHydrationWarning
		>
			{theme === "light" ? <LightLogo /> : <DarkLogo />}

			<span className={cn("text-xl font-black text-foreground select-none", font.className)}>
				kent gözlem
			</span>
		</a>
	);
}
