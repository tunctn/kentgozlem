import MapContextMenu from "../components/map-context-menu";
import { MapControls } from "../components/map-controls";
import MapLayout from "../components/map-layout";
import MapPanel from "../components/map-panel";
import { Mapbox } from "../components/mapbox";

export default async function Home() {
	return (
		<div className="h-full w-full">
			<MapLayout>
				<Mapbox />
				<MapContextMenu />

				<MapPanel className="flex items-center gap-2" position="bottom-right">
					<MapControls />
				</MapPanel>
			</MapLayout>
		</div>
	);
}
