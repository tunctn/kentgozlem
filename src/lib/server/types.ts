import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";

export type ApiHandler<T extends ValidationSchemas> = (
	req: ValidatedRequest<T>,
) => Promise<unknown>;

export type Middleware = <T extends ValidationSchemas>(handler: ApiHandler<T>) => ApiHandler<T>;
