import type { ApiRequestContext } from "./api-route";
import type { ValidatedRequest, ValidationSchemas } from "./validation-handler";

export type ApiHandler<T extends ValidationSchemas, R = ValidatedRequest<T>> = (
	req: R,
	context: ApiRequestContext,
) => Promise<unknown>;

export type Middleware<
	TInput extends ValidationSchemas = ValidationSchemas,
	TReqIn extends ValidatedRequest<TInput> = ValidatedRequest<TInput>,
	TReqOut extends TReqIn = TReqIn,
	TExtend = unknown, // Add this generic parameter
> = (handler: ApiHandler<TInput, TReqOut & TExtend>) => ApiHandler<TInput, TReqIn & TExtend>;
