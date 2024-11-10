import type { ApiRequestContext } from "./api-route";
import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";

export type ApiHandler<T extends ValidationSchemas> = (
	req: ValidatedRequest<T>,
	context: ApiRequestContext,
) => Promise<unknown>;

export type Middleware = <T extends ValidationSchemas>(handler: ApiHandler<T>) => ApiHandler<T>;
