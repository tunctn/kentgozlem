import type { NextApiRequest } from "next";
import type { z } from "zod";

import { ApiError, withErrorHandler } from "./error-handler";

export type ValidationSchemas = {
	params?: z.ZodType;
	query?: z.ZodType;
	body?: z.ZodType;
};

type InferSchemaType<T> = T extends z.ZodType ? z.infer<T> : never;

export type ValidatedRequest<T extends ValidationSchemas> = NextApiRequest & {
	params: T["params"] extends z.ZodType ? InferSchemaType<T["params"]> : never;
	query: T["query"] extends z.ZodType ? InferSchemaType<T["query"]> : never;
	body: T["body"] extends z.ZodType ? InferSchemaType<T["body"]> : never;
};

export const withValidation = <T extends ValidationSchemas>(
	schemas: T,
	fn: (req: ValidatedRequest<T>) => Promise<unknown>,
) => {
	return withErrorHandler(async (req: NextApiRequest) => {
		const validatedData: Record<string, unknown> = {};

		// Validate params if schema exists
		if (schemas.params) {
			const result = schemas.params.safeParse(req.query);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.params = result.data;
		}

		// Validate query if schema exists
		if (schemas.query) {
			const url = new URL(req.url ?? "");
			const searchParams = Object.fromEntries(url.searchParams);
			const result = schemas.query.safeParse(searchParams);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.query = result.data;
		}

		// Validate body if schema exists
		if (schemas.body) {
			const body = await req.body();
			const result = schemas.body.safeParse(body);
			if (!result.success) throw new ApiError(400, result.error);
			validatedData.body = result.data;
		}

		return fn({
			...req,
			...validatedData,
		} as ValidatedRequest<T>);
	});
};
