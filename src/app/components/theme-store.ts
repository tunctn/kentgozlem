import { getCookie, removeCookie, saveCookie } from "@/utils/cookies";
import { getAutoTheme } from "@/utils/get-auto-theme";

import { COOKIES } from "@/lib/cookies";
import { create } from "zustand";
import type { LightPreset } from "./mapbox";

export type Theme = "light" | "dark";

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme | null) => void;

	lightPreset: LightPreset | "auto";
	setLightPreset: (lightPreset: LightPreset | "auto") => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
	theme: (() => {
		const theme = getCookie(COOKIES.THEME);
		return theme ?? getAutoTheme().theme;
	})(),
	setTheme: (theme: Theme | null) => {
		if (theme) {
			saveCookie(COOKIES.THEME, theme);
			set({ theme });
		} else {
			removeCookie(COOKIES.THEME);
			set({ theme: getAutoTheme().theme });
		}
	},

	lightPreset: (() => {
		const lightPreset = getCookie(COOKIES.MAPBOX_LIGHT_PRESET);
		return lightPreset ?? getAutoTheme().lightPreset;
	})(),
	setLightPreset: (lightPreset: LightPreset | null) => {
		if (lightPreset) {
			saveCookie(COOKIES.MAPBOX_LIGHT_PRESET, lightPreset);
			set({ lightPreset });
		} else {
			removeCookie(COOKIES.MAPBOX_LIGHT_PRESET);
			set({ lightPreset: "auto" });
		}
	},
}));
