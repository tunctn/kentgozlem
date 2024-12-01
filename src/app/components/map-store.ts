import { COOKIES } from "@/lib/cookies";
import { getCookie, saveCookie } from "@/utils/cookies";
import { create } from "zustand";
import type { MapViewState, UserCoords } from "./mapbox";

interface MapCoords {
	lat: number;
	lng: number;
}

interface ContextMenu {
	open: boolean;
	spawnCoords: { x: number; y: number };
	mapCoords: MapCoords;
}

// Istanbul's coordinates
export const defaultViewState: MapViewState = {
	center: [29.026005309371357, 41.01624869192369],
	zoom: 11.5,
	pitch: 0,
	bearing: 0,
};

interface SetViewStateArgs {
	viewState: MapViewState;
	saveCookie?: boolean;
}

interface MapStore {
	map: mapboxgl.Map | null;
	setMap: (map: mapboxgl.Map | null) => void;

	loaded: boolean;
	setLoaded: (loaded: boolean) => void;

	isDraggingCompass: boolean;
	setIsDraggingCompass: (isDragging: boolean) => void;

	viewState: MapViewState;
	setViewState: (args: SetViewStateArgs) => void;

	contextMenu: ContextMenu;
	setContextMenu: (contextMenu: ContextMenu) => void;

	userCoords: MapCoords;
	setUserCoords: (userCoords: MapCoords) => void;

	show3dObjects: boolean;
	setShow3dObjects: (show3dObjects: boolean) => void;

	locateUser: () => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
	map: null,
	setMap: (map: mapboxgl.Map | null) => set({ map }),

	loaded: false,
	setLoaded: (loaded: boolean) => set({ loaded }),

	isDraggingCompass: false,
	setIsDraggingCompass: (isDragging: boolean) => set({ isDraggingCompass: isDragging }),

	userCoords: { lat: 0, lng: 0 },
	setUserCoords: (userCoords) => set({ userCoords }),

	// Istanbul's coordinates
	viewState: defaultViewState,
	setViewState: (args) => {
		if (args.saveCookie) saveCookie(COOKIES.MAP_VIEW_STATE, args.viewState);

		set({ viewState: args.viewState });
	},

	contextMenu: {
		open: false,
		spawnCoords: { x: 0, y: 0 },
		mapCoords: { lat: 0, lng: 0 },
	},
	setContextMenu: (contextMenu) => {
		set({ contextMenu: { ...contextMenu } });
	},

	show3dObjects: (() => {
		const show3dObjects = getCookie(COOKIES.MAPBOX_3D_OBJECTS);
		return show3dObjects;
	})(),
	setShow3dObjects: (show3dObjects: boolean) => {
		saveCookie(COOKIES.MAPBOX_3D_OBJECTS, show3dObjects ? "true" : "false");
		set({ show3dObjects });
	},

	locateUser: () => {
		if (!get().map) return;
		if (!("geolocation" in navigator)) return;

		navigator.geolocation.getCurrentPosition((position) => {
			const userCoords: UserCoords = [position.coords.longitude, position.coords.latitude];

			const mapViewState: MapViewState = {
				center: userCoords,
				zoom: 15.5,
				pitch: 0,
				bearing: 0,
			};

			saveCookie(COOKIES.LAST_USER_COORDS, userCoords);
			set({ userCoords: { lat: userCoords[1], lng: userCoords[0] } });
			get().setViewState({ viewState: mapViewState, saveCookie: true });

			const map = get().map;
			if (!map) return;

			map.easeTo(mapViewState);
		});
	},
}));
