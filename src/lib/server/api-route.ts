import type { NextRequest } from "next/server";
import type { AuthUser } from "../auth.config";
import { withAuth, withLooseAuth } from "./auth-handlers";
import type { ApiHandler, Middleware } from "./types";
import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";
import { withValidation } from "./validation-handler";

export type ApiRequest = ValidatedRequest<ValidationSchemas>;

export type ApiRequestContext = {
	params: Record<string, string>;
};

type ProtectedRequest<T extends ValidationSchemas> = ValidatedRequest<T> & { user: AuthUser };
type LooseRequest<T extends ValidationSchemas> = ValidatedRequest<T> & { user: AuthUser | null };

class ApiRoute<T extends ValidationSchemas> {
	private middlewares: Middleware[] = [];

	constructor(private schemas: T) {}

	public withMiddleware(middleware: Middleware) {
		this.middlewares.push(middleware);
		return this;
	}

	protected createRoute<R extends ValidatedRequest<T>>(
		handler: (req: R) => Promise<unknown>,
		authWrapper?: Middleware,
	) {
		// Start with the original handler
		let finalHandler = handler as ApiHandler<T>;

		// Apply auth wrapper first if it exists
		if (authWrapper) {
			finalHandler = authWrapper(finalHandler);
		}

		// Then apply validation
		finalHandler = withValidation(this.schemas, finalHandler);

		// Finally apply other middlewares in reverse order
		for (const middleware of [...this.middlewares].reverse()) {
			const previousHandler = finalHandler;
			finalHandler = async (req) => {
				return await middleware(previousHandler)(req as never);
			};
		}

		return finalHandler as unknown as (req: NextRequest) => Promise<unknown>;
	}

	protected route(fn: (req: ValidatedRequest<T>) => Promise<unknown>) {
		return this.createRoute(fn);
	}

	public protected(fn: (req: ProtectedRequest<T>) => Promise<unknown>) {
		return this.createRoute(fn, withAuth);
	}

	public loose(fn: (req: LooseRequest<T>) => Promise<unknown>) {
		return this.createRoute(fn, withLooseAuth);
	}

	public public(fn: (req: ValidatedRequest<T>) => Promise<unknown>) {
		return this.createRoute(fn);
	}
}

export const apiRoute = <T extends ValidationSchemas>(schemas: T) => new ApiRoute<T>(schemas);
