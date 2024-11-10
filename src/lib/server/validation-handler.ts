import type { NextRequest } from "next/server";
import type { z } from "zod";

import type { ApiRequestContext } from "./api-route";
import { ApiError, withErrorHandler } from "./error-handler";

export type ValidationSchemas = {
	params?: z.ZodType;
	query?: z.ZodType;
	body?: z.ZodType;
};

type InferSchemaType<T> = T extends z.ZodType ? z.infer<T> : never;

export type ValidatedRequest<T extends ValidationSchemas> = NextRequest & {
	params: T["params"] extends z.ZodType ? InferSchemaType<T["params"]> : never;
	query: T["query"] extends z.ZodType ? InferSchemaType<T["query"]> : never;
	body: T["body"] extends z.ZodType ? InferSchemaType<T["body"]> : never;
};

export const withValidation = <T extends ValidationSchemas>(
	schemas: T,
	fn: (req: ValidatedRequest<T>, context: ApiRequestContext) => Promise<unknown>,
) => {
	return withErrorHandler(async (req: NextRequest, context: ApiRequestContext) => {
		const validatedData: Record<string, unknown> = {};

		// Validate params if schema exists
		if (schemas.params) {
			const params = await Promise.resolve(context.params);
			const result = schemas.params.safeParse(params);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.params = result.data;
		}

		// Validate query if schema exists
		if (schemas.query) {
			const searchParams = Object.fromEntries(req.nextUrl?.searchParams ?? new URLSearchParams());
			const result = schemas.query.safeParse(searchParams);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.query = result.data;
		}

		// Validate body if schema exists
		if (schemas.body) {
			const body = await req.json().catch(() => ({}));
			const result = schemas.body.safeParse(body);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.body = result.data;
		}

		return fn(
			{
				...req,
				...validatedData,
			} as ValidatedRequest<T>,
			context,
		);
	});
};
