import { type NextRequest, NextResponse } from "next/server";
import type { ApiRequestContext } from "./api-route";
import { withCors } from "./cors-handler";

export class ApiError extends Error {
	public status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export const withErrorHandler = <T>(
	fn: (req: NextRequest, context: ApiRequestContext) => Promise<T>,
) => {
	return withCors(async (req: NextRequest, context: ApiRequestContext) => {
		try {
			return await fn(req, context);
		} catch (error) {
			if (error instanceof ApiError) {
				return NextResponse.json({ message: error.message }, { status: error.status });
			}
			console.error("Internal server error:", error);
			return NextResponse.json({ message: "Internal server error" }, { status: 500 });
		}
	});
};
