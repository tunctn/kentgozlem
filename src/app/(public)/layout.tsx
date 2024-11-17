import Logo from "@/components/logo";
import { ProfileButton } from "@/components/profile-button";
import { SignInButton } from "@/components/sign-in-button";
import { SignUpButton } from "@/components/sign-up-button";
import { getUser } from "@/server/get-user";

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getUser();
	return (
		<div className="h-full w-full relative flex flex-col">
			<div
				className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-3 pb-0"
				suppressHydrationWarning
			>
				<Logo className="relative" />

				<div className="flex items-center gap-2">
					{user ? (
						<ProfileButton user={user.user} />
					) : (
						<div className="flex items-center gap-2">
							<SignInButton />
							<div className="hidden md:block">
								<SignUpButton />
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="h-full w-full">{children}</div>
		</div>
	);
}
