import Logo from "@/components/logo";
import { getInitialMapConfig } from "@/utils/get-initial-map-config";

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { theme } = await getInitialMapConfig();

	return (
		<div className=" relative flex flex-col">
			<div className="flex items-center justify-center p-3">
				<Logo className="relative" theme={theme} />
			</div>

			<div className="max-w-2xl p-3 mx-auto text-xs pb-10">{children}</div>
		</div>
	);
}
