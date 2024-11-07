import { GoogleMaps } from "@/components/google-maps";
import { SignInButton } from "@/components/sign-in-button";
import { SignUpButton } from "@/components/sign-up-button";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth();
	return (
		<div className="h-full w-full">
			<div className="h-full w-full relative">
				<div className="absolute z-[10] top-3 right-3 flex items-center gap-2">
					<SignInButton />
					<SignUpButton />
				</div>
				<GoogleMaps />
			</div>
		</div>
	);
}
