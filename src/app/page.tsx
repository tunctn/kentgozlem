import { SignInButton } from "@/components/sign-in-button";
import { SignUpButton } from "@/components/sign-up-button";
import { auth } from "@/lib/auth";
import MapContextMenu from "./components/map-context-menu";
import { MapControls } from "./components/map-controls";
import MapLayout from "./components/map-layout";
import MapPanel from "./components/map-panel";
import { Mapbox } from "./components/mapbox";

export default async function Home() {
	const session = await auth();
	return (
		<div className="h-full w-full">
			<div className="h-full w-full relative ">
				<MapLayout>
					<Mapbox />
					<MapContextMenu />
					<MapPanel className="flex items-center gap-2" position="top-right">
						<SignInButton />
						<SignUpButton />
					</MapPanel>

					<MapPanel className="flex items-center gap-2" position="bottom-right">
						<MapControls />
					</MapPanel>
				</MapLayout>
			</div>
		</div>
	);
}
