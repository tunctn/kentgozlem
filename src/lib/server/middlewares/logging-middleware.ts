import type { Middleware } from "../types";

export const sampleMiddleware: Middleware = (handler) => async (req, context) => {
	console.log("Sample middleware running...");
	return await handler(req, context);
};
