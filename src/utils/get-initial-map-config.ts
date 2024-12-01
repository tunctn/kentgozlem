import { defaultViewState } from "@/app/components/map-store";
import type { LightPreset, MapViewState, UserCoords } from "@/app/components/mapbox";
import type { Theme } from "@/app/components/theme-store";
import { COOKIES } from "@/lib/cookies";
import { cookies } from "next/headers";
import { getAutoTheme } from "./get-auto-theme";

export type InitialMapConfig = {
	show3dObjects: boolean;
	lightPreset: LightPreset;
	viewState: MapViewState;
	theme: Theme;
};

const parseCenter = (center: [number, number]) => {
	return (center as unknown as string)
		?.replace(/[\[\]]/g, "")
		.split(",")
		.map(Number) as [number, number];
};

export const getInitialMapConfig = async (): Promise<InitialMapConfig> => {
	const cookieStore = await cookies();

	const initialConfig: InitialMapConfig = {
		show3dObjects: false,
		lightPreset: getAutoTheme().lightPreset,
		viewState: defaultViewState,
		theme: getAutoTheme().theme,
	};

	// Get mapbox 3d objects
	const show3dObjects = cookieStore.get(COOKIES.MAPBOX_3D_OBJECTS)?.value;
	if (show3dObjects) {
		initialConfig.show3dObjects = show3dObjects === "true";
	}

	// Get mapbox light preset
	const lightPreset = cookieStore.get(COOKIES.MAPBOX_LIGHT_PRESET)?.value as unknown as
		| LightPreset
		| "auto";
	if (lightPreset) {
		if (lightPreset === "auto") {
			initialConfig.lightPreset = getAutoTheme().lightPreset;
		} else {
			initialConfig.lightPreset = lightPreset;
		}
	}

	// Get theme
	const theme = cookieStore.get(COOKIES.THEME)?.value as unknown as Theme;
	if (theme) {
		initialConfig.theme = theme;
	}

	// Get map view state
	const localViewState = cookieStore.get(COOKIES.MAP_VIEW_STATE)?.value;
	const lastUserCoords = cookieStore.get(COOKIES.LAST_USER_COORDS)?.value as unknown as UserCoords;

	if (localViewState) {
		try {
			const parsedViewState = JSON.parse(localViewState) as MapViewState;
			initialConfig.viewState = parsedViewState;

			if (lastUserCoords) {
				initialConfig.viewState = {
					center: parseCenter(lastUserCoords),
					zoom: 15.5,
					pitch: 0,
					bearing: 0,
				};
			}
		} catch (err) {
			console.error(err);
		}
	}

	return initialConfig;
};
