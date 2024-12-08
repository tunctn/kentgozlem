import { getUser } from "@/server/get-user";
import { getInitialMapConfig } from "@/utils/get-initial-map-config";
import { FetchingReportsIndicator } from "../components/fetching-reports-indicator";
import MapContextMenu from "../components/map-context-menu";
import { MapControls } from "../components/map-controls";
import MapLayout from "../components/map-layout";
import MapPanel from "../components/map-panel";
import { Mapbox } from "../components/mapbox";
import { MapReports } from "./map-reports";

export default async function Home() {
	const { user } = await getUser();
	const { lightPreset, show3dObjects, viewState } = await getInitialMapConfig();

	return (
		<div className="h-full w-full">
			<MapLayout>
				<Mapbox initialConfig={{ lightPreset, show3dObjects, viewState }} />
				<MapReports />
				<MapContextMenu user={user} />
				<MapPanel className="flex items-center gap-2" position="top-center">
					<FetchingReportsIndicator />
				</MapPanel>
				<MapPanel className="flex items-center gap-2" position="bottom-right">
					<MapControls />
				</MapPanel>
			</MapLayout>
		</div>
	);
}
