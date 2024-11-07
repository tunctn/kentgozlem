export const saveToLocalStorage = (key: string, value: string | object) => {
	if (!window) return;
	if (!window.localStorage) return;
	window.localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value);
};

export const getFromLocalStorage = (key: string) => {
	if (!window) return null;
	if (!window.localStorage) return null;
	const value = window.localStorage.getItem(key);

	try {
		return JSON.parse(value ?? "");
	} catch (error) {
		return value ?? null;
	}
};
