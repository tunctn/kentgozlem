import { v7 as uuidv7 } from "uuid";

export const MAX_IDENTIFIER_KEY_LENGTH = 32;

export const toSlug = (string: string | undefined) => {
	if (!string) return uuidv7();
	return (
		string
			// Replace non-English chars with their English equivalent
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.replace(/œ/gi, "oe")
			.replace(/æ/gi, "ae")
			.replace(/[ß]/g, "ss")
			// Replace non-alphanumeric characters with underscores
			.replace(/[^a-zA-Z0-9_]/g, "_")
			// Limit the length of the identifier key
			.slice(0, MAX_IDENTIFIER_KEY_LENGTH)
			.replace(/^_+|_+$/g, "") // Remove leading and trailing underscores
			.replace(/_+/g, "_") // Replace multiple underscores with a single underscore
			.toLowerCase() // Convert to lowercase
	);
};
