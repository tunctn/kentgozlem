import type { ValidatedRequest, ValidationSchemas } from "@/lib/server/validation-handler";
import type { Middleware } from "../types";

// Generic type for any middleware extension
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type MiddlewareExtension = Record<string, any>;

// Updated middleware creator that preserves existing request extensions
export const apiMiddleware = <E extends MiddlewareExtension>(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	extensionBuilder: (req: ValidatedRequest<any>) => E | Promise<E>,
) => {
	return <T extends ValidationSchemas, R extends ValidatedRequest<T>>(): Middleware<T, R, R & E> =>
		(handler) =>
		async (req, context) => {
			const extension = await extensionBuilder(req);
			return await handler(Object.assign(req, extension), context);
		};
};
