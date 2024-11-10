import { type NextRequest, NextResponse } from "next/server";
import { env } from "../env";
import type { ApiRequestContext } from "./api-route";

export const withCors = (
	handler: (req: NextRequest, context: ApiRequestContext) => Promise<unknown>,
) => {
	return async (req: NextRequest, context: ApiRequestContext) => {
		const origin = req.headers?.get?.("origin") ?? null;

		const allowedOrigins = env.ALLOWED_CORS_ORIGINS.split(",");
		const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

		const headers = {
			"Access-Control-Allow-Origin": corsOrigin,
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Credentials": "true",
		};

		// Handle preflight requests
		if (req.method === "OPTIONS") {
			return NextResponse.json({}, { status: 200, headers });
		}

		// Proceed to the next handler and include CORS headers
		const response = await handler(req, context);
		if (response instanceof NextResponse) {
			for (const [key, value] of Object.entries(headers)) {
				response.headers.set(key, value);
			}
		}
		return response;
	};
};
