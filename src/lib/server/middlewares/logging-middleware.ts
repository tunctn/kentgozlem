import { apiMiddleware } from "./builder";

export const loggingMiddleware = apiMiddleware<{ sample: string }>(async (req) => {
	return { sample: "sample" };
});
