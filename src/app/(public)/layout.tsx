import Logo from "@/components/logo";
import { ProfileButton } from "@/components/profile-button";
import { getUser } from "@/server/get-user";
import { getInitialMapConfig } from "@/utils/get-initial-map-config";

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = await getUser();
	const { theme } = await getInitialMapConfig();

	return (
		<div className="h-full w-full relative flex flex-col">
			<div
				className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-3 pb-0"
				suppressHydrationWarning
			>
				<Logo className="relative" theme={theme} />

				<div className="flex items-center gap-2">
					<ProfileButton user={user} />
				</div>
			</div>

			<div className="h-full w-full">{children}</div>
		</div>
	);
}
