import { MapBox } from "@/components/mapbox";
import { SignInButton } from "@/components/sign-in-button";
import { SignUpButton } from "@/components/sign-up-button";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth();
	return (
		<div>
			{session?.user?.email}
			<SignInButton />
			<SignUpButton />
			<MapBox />
		</div>
	);
}
