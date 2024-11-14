import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { useMapStore } from "./components/map-store";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Kent Gözlem",
	description:
		"Kent Gözlem, şüpheli bina ve yapıları bildirmenize olanak sağlayan bir kentsel gözetim platformudur. Güvenli bir şehir için vatandaş katılımını destekler.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const lightPreset = useMapStore.getState().lightPreset;
	const isLight = lightPreset === "day" || lightPreset === "dawn";
	return (
		<html lang="tr" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider attribute="class" forcedTheme={isLight ? "light" : "dark"}>
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<Providers>{children}</Providers>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
