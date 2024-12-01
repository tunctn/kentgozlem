import Logo from "@/components/logo";

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className=" relative flex flex-col">
			<div className="flex items-center justify-center p-3">
				<Logo className="relative" />
			</div>

			<div className="max-w-2xl p-3 mx-auto text-xs pb-10">{children}</div>
		</div>
	);
}
