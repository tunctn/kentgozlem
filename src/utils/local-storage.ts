type LocalStorageKey = "map-view-state" | "last-user-coords";

export type MapViewState = {
	center: [number, number];
	zoom: number;
	pitch: number;
	bearing: number;
};
export type UserCoords = [number, number];

type LocalStorageValues = {
	"map-view-state": MapViewState;
	"last-user-coords": UserCoords;
};

export const saveToLocalStorage = <K extends LocalStorageKey>(
	key: K,
	value: LocalStorageValues[K],
) => {
	if (typeof document === "undefined") return;
	const expirationDate = new Date();
	expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month expiration
	document.cookie = `${key}=${JSON.stringify(value)}; expires=${expirationDate.toUTCString()}; path=/`;
};

export const getFromLocalStorage = <K extends LocalStorageKey>(
	key: K,
): LocalStorageValues[K] | null => {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((c) => c.startsWith(`${key}=`));
	if (!cookie) return null;

	try {
		return JSON.parse(cookie.split("=")[1]);
	} catch (error) {
		return null;
	}
};
