"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"light" as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				unstyled: true,
				classNames: {
					toast: "glass-looking rounded-lg w-full px-4 py-4 text-[13px] flex gap-2 items-center",
					description: "group-[.toast]:text-muted-foreground",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
