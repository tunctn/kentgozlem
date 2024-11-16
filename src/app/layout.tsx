import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api-client";
import { COOKIES } from "@/lib/cookies";
import { lucia } from "@/lib/lucia";
import { getTheme } from "@/utils/get-theme";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Kent Gözlem",
	description:
		"Kent Gözlem, şüpheli bina ve yapıları bildirmenize olanak sağlayan bir kentsel gözetim platformudur. Güvenli bir şehir için vatandaş katılımını destekler.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { theme } = getTheme();

	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(COOKIES.AUTH_COOKIE);
	if (sessionCookie) {
		const { session, user } = await lucia.validateSession(sessionCookie.value);
		if (session?.fresh) {
			await api.post("/auth/refresh");
		}
		if (!session || !user) {
			await api.post("/auth/logout");
		}
	}

	return (
		<html lang="tr" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider attribute="class" forcedTheme={theme === "dark" ? "dark" : "light"}>
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
