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

class ApiRoute<
	T extends ValidationSchemas,
	R extends ValidatedRequest<T> = ValidatedRequest<T>,
	TExtend = unknown,
> {
	private middlewares: Middleware<T, R, R, TExtend>[] = [];

	constructor(private schemas: T) {}

	public withMiddleware<NewR extends R, NewExtend = TExtend>(
		middleware: Middleware<T, R, NewR, NewExtend>,
	) {
		this.middlewares.push(middleware as unknown as Middleware<T, R, R, TExtend>);
		return this as unknown as ApiRoute<T, NewR, NewExtend>;
	}

	protected createRoute<FinalR extends R>(
		handler: (req: FinalR, context: ApiRequestContext) => Promise<unknown>,
		withAuth?: Middleware<T, FinalR>,
	) {
		const route = (req: NextRequest, context: ApiRequestContext) => {
			return withValidation(
				this.schemas,
				async (req: ValidatedRequest<T>, context: ApiRequestContext) => {
					const withMiddlewares = [...this.middlewares]
						.reverse()
						// biome-ignore lint/suspicious/noExplicitAny: Any because TypeScript can't guarantee type safety in the middleware reduction chain.
						.reduce<ApiHandler<T, any>>((acc, middleware) => middleware(acc), handler);

					if (withAuth) {
						return withAuth(withMiddlewares)(req as FinalR, context);
					}
					return withMiddlewares(req as FinalR, context);
				},
			)(req, context);
		};

		return route as unknown as (req: NextRequest) => Promise<void>;
	}

	public protected(
		fn: (
			req: ProtectedRequest<T> & Omit<R, keyof ValidatedRequest<T>>,
			context: ApiRequestContext,
		) => Promise<unknown>,
	) {
		// biome-ignore lint/suspicious/noExplicitAny: Any because TypeScript can't guarantee type safety in the middleware reduction chain.
		return this.createRoute(fn as any, withAuth as any);
	}

	public loose(
		fn: (
			req: LooseRequest<T> & Omit<R, keyof ValidatedRequest<T>>,
			context: ApiRequestContext,
		) => Promise<unknown>,
	) {
		// biome-ignore lint/suspicious/noExplicitAny: Any because TypeScript can't guarantee type safety in the middleware reduction chain.
		return this.createRoute(fn as any, withLooseAuth as any);
	}

	public public(fn: (req: R, context: ApiRequestContext) => Promise<unknown>) {
		return this.createRoute(fn);
	}
}

export const apiRoute = <T extends ValidationSchemas>(schemas: T) => new ApiRoute<T>(schemas);
