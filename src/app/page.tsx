import { SignInButton } from "@/components/sign-in-button";
import { SignUpButton } from "@/components/sign-up-button";
import { auth } from "@/lib/auth";
import { Mapbox } from "./components/mapbox";

export default async function Home() {
	const session = await auth();
	return (
		<div className="h-full w-full">
			<div className="h-full w-full relative ">
				<div className="absolute z-[10] top-3 right-3 flex items-center gap-2">
					<SignInButton />
					<SignUpButton />
				</div>

				<Mapbox />

				<div className="absolute z-[10] bottom-3 right-3">dang!</div>
			</div>
		</div>
	);
}
