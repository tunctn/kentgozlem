import type { AuthUser } from "@/db/schema";
import type { Session } from "lucia";
import type { NextRequest } from "next/server";
import { withAuth, withLooseAuth } from "./auth-handlers";
import type { ApiHandler, Middleware } from "./types";
import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";
import { withValidation } from "./validation-handler";

export type ApiRequest = ValidatedRequest<ValidationSchemas>;

export type ApiRequestContext = {
	params: Record<string, string>;
};

type ProtectedRequest<T extends ValidationSchemas> = ValidatedRequest<T> & {
	user: AuthUser;
	session: Session;
};
type LooseRequest<T extends ValidationSchemas> = ValidatedRequest<T> & {
	user: AuthUser | null;
	session: Session | null;
};

class ApiRoute<T extends ValidationSchemas> {
	private middlewares: Middleware[] = [];

	constructor(private schemas: T) {}

	public withMiddleware(middleware: Middleware) {
		this.middlewares.push(middleware);
		return this;
	}

	protected createRoute<R extends ValidatedRequest<T>>(
		handler: (req: R, context: ApiRequestContext) => Promise<unknown>,
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
			finalHandler = async (req, context) => {
				return await middleware(previousHandler)(req as never, context);
			};
		}

		return finalHandler as unknown as (req: NextRequest) => Promise<void>;
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
