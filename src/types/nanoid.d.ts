declare namespace nanoid {
	/**
	 * Generate secure URL-friendly unique ID.
	 *
	 * By default, the ID will have 21 symbols to have a collision probability
	 * similar to UUID v4.
	 *
	 * @param size Size of the ID. The default size is 21.
	 * @returns A random string.
	 */
	export function nanoid(size?: number): string;

	/**
	 * Generate secure unique ID with custom alphabet.
	 *
	 * @param alphabet Alphabet used to generate the ID.
	 * @param defaultSize Size of the ID. The default size is 21.
	 * @returns A random string generator.
	 */
	export function customAlphabet(alphabet: string, defaultSize?: number): (size?: number) => string;

	/**
	 * Generate unique ID with custom random generator and alphabet.
	 *
	 * @param alphabet Alphabet used to generate a random string.
	 * @param size Size of the random string.
	 * @param random A random bytes generator.
	 * @returns A random string generator.
	 */
	export function customRandom(
		alphabet: string,
		size: number,
		random: (bytes: number) => Uint8Array,
	): () => string;

	/**
	 * URL safe symbols.
	 */
	export const urlAlphabet: string;

	/**
	 * Generate an array of random bytes collected from hardware noise.
	 *
	 * @param bytes Size of the array.
	 * @returns An array of random bytes.
	 */
	export function random(bytes: number): Uint8Array;
}

export = nanoid;
