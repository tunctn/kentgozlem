import type { LightPreset } from "@/app/components/map-store";

export const getTheme = (): { lightPreset: LightPreset; theme: "light" | "dark" } => {
	// Get current time and create Date object
	const now = new Date();
	const hours = now.getHours();

	// Simple time-based light preset selection
	let lightPreset: LightPreset;
	if (hours >= 5 && hours < 7) {
		lightPreset = "dawn";
	} else if (hours >= 7 && hours < 17) {
		lightPreset = "day";
	} else if (hours >= 17 && hours < 19) {
		lightPreset = "dusk";
	} else {
		lightPreset = "night";
	}
	lightPreset as LightPreset;

	return {
		lightPreset,
		theme: lightPreset === "day" || lightPreset === "dawn" ? "light" : "dark",
	};
};
