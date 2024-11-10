import type { NextRequest } from "next/server";
import type { AuthUser } from "../auth.config";
import { withAuth, withLooseAuth } from "./auth-handlers";
import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";
import { withValidation } from "./validation-handler";

export type ApiRequest = ValidatedRequest<ValidationSchemas>;

export type ApiRequestContext = {
	params: Record<string, string>;
};

type ProtectedRequest<T extends ValidationSchemas> = ValidatedRequest<T> & { user: AuthUser };
type LooseRequest<T extends ValidationSchemas> = ValidatedRequest<T> & { user: AuthUser | null };

type Middleware = <T extends ValidationSchemas>(
	handler: (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>,
) => (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>;

class ApiRoute<T extends ValidationSchemas> {
	private middlewares: Middleware[] = [];

	constructor(private schemas: T) {}

	public withMiddleware(middleware: Middleware) {
		this.middlewares.push(middleware);
		return this;
	}

	protected createRoute<R extends ValidatedRequest<T>>(
		handler: (req: R, context: ApiRequestContext) => Promise<unknown>,
		authWrapper?: (
			handler: (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>,
		) => (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>,
	) {
		let finalHandler = withValidation(
			this.schemas,
			handler as (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>,
		);

		// Apply middlewares in reverse order and return an async function
		for (const middleware of [...this.middlewares].reverse()) {
			const previousHandler = finalHandler;
			finalHandler = async (req, context) => {
				return await middleware(previousHandler)(req as never, context);
			};
		}

		if (authWrapper) {
			finalHandler = authWrapper(finalHandler) as (
				req: NextRequest,
				context: ApiRequestContext,
			) => Promise<unknown>;
		}

		return finalHandler;
	}

	protected route(fn: (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>) {
		return this.createRoute(fn);
	}

	public protected(fn: (req: ProtectedRequest<T>, context: ApiRequestContext) => Promise<unknown>) {
		return this.createRoute(fn, withAuth);
	}

	public loose(fn: (req: LooseRequest<T>, context: ApiRequestContext) => Promise<unknown>) {
		return this.createRoute(fn, withLooseAuth);
	}

	public public(fn: (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>) {
		return this.createRoute(fn);
	}
}

export const apiRoute = <T extends ValidationSchemas>(schemas: T) => new ApiRoute<T>(schemas);

const loggingMiddleware: Middleware = (handler) => async (req, context) => {
	console.log("Before request");
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const result = await handler(req, context);
	console.log("After request");
	return result;
};
