export const saveCookie = (key: string, value: string | object) => {
	if (typeof document === "undefined") return;
	const expirationDate = new Date();
	expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month expiration

	if (typeof value === "string") {
		document.cookie = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
	} else {
		document.cookie = `${key}=${JSON.stringify(value)}; expires=${expirationDate.toUTCString()}; path=/`;
	}
};

export const getCookie = (key: string) => {
	if (typeof document === "undefined") return null;
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((c) => c.startsWith(`${key}=`));
	if (!cookie) return null;

	const value = cookie.split("=")[1];
	if (!value) return null;
	if (value === "true" || value === "false") return value === "true";
	if (typeof value === "string") return value;
	if (value === "null") return null;
	if (value === "undefined") return undefined;
	if (Number.isNaN(Number(value))) return value;

	try {
		return JSON.parse(value);
	} catch (error) {
		return null;
	}
};

export const removeCookie = (key: string) => {
	if (typeof document === "undefined") return;
	document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
