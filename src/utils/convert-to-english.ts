export const convertToEnglish = (text: string) => {
	return (
		text
			// Replace non-English chars with their English equivalent
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.replace(/œ/gi, "oe")
			.replace(/æ/gi, "ae")
			.replace(/[ß]/g, "ss")
	);
};
