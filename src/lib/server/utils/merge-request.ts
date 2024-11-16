// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const mergeRequest = (req: Request, validatedData: any) => {
	const proxy = new Proxy(req, {
		get(target, prop) {
			// Check validatedData first, then fall back to original request
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return prop in validatedData ? validatedData[prop] : (target as any)[prop];
		},
	});

	return proxy as unknown;
};
