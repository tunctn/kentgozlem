import { create } from "zustand";

interface MapboxStore {
	map: mapboxgl.Map;
	setMap: (map: mapboxgl.Map) => void;
}

export const useMapboxStore = create<MapboxStore>((set) => ({
	map: {} as mapboxgl.Map,
	setMap: (map: mapboxgl.Map) => set({ map }),
}));
