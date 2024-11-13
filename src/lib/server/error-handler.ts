import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { withCors } from "./cors-handler";

export class ApiError extends Error {
	public status: number;
	constructor(status: number, message: string | ZodError | object) {
		super(typeof message === "string" ? message : JSON.stringify(message));
		this.status = status;
	}
}

export const withErrorHandler = <T>(fn: (req: NextApiRequest) => Promise<T>) => {
	return withCors(async (req: NextApiRequest) => {
		try {
			return await fn(req);
		} catch (error) {
			if (error instanceof ApiError) {
				try {
					const message = JSON.parse(error.message);
					return NextResponse.json(message, { status: error.status });
				} catch {
					return NextResponse.json({ message: error.message }, { status: error.status });
				}
			}
			console.error("Internal server error:", error);
			return NextResponse.json({ message: "Internal server error" }, { status: 500 });
		}
	});
};
