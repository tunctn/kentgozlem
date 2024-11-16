// Original source:
// https://github.com/lodash/lodash/blob/4.0.6-npm-packages/lodash.isplainobject/index.js

// Converted to TypeScript by @tunctn

const objectTag = "[object Object]";
function isHostObject(value: unknown): boolean {
	// Many host objects are `Object` objects that can coerce to strings
	// despite having improperly defined `toString` methods.
	let result = false;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	if (value !== null && typeof (value as any).toString !== "function") {
		try {
			result = !!`${value}`;
		} catch (e) {}
	}
	return result;
}

function overArg<T, R>(func: (arg: R) => unknown, transform: (arg: T) => R): (arg: T) => unknown {
	return (arg: T): unknown => func(transform(arg));
}

const funcProto = Function.prototype;
const objectProto = Object.prototype;

const funcToString = funcProto.toString;

const hasOwnProp = objectProto.hasOwnProperty;

const objectCtorString = funcToString.call(Object);

const objectToString = objectProto.toString;

const getPrototype = overArg(Object.getPrototypeOf, Object);

function isObjectLike(value: unknown): boolean {
	return !!value && typeof value === "object";
}

export function isPlainObject(value: unknown): boolean {
	if (!isObjectLike(value) || objectToString.call(value) !== objectTag || isHostObject(value)) {
		return false;
	}
	const proto = getPrototype(value);
	if (proto === null) {
		return true;
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const Ctor = hasOwnProp.call(proto, "constructor") && (proto as any).constructor;
	return (
		typeof Ctor === "function" &&
		Ctor instanceof Ctor &&
		funcToString.call(Ctor) === objectCtorString
	);
}
