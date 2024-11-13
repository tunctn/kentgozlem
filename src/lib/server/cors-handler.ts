import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { env } from "../env";

export const withCors = (handler: (req: NextApiRequest) => Promise<unknown>) => {
	return async (req: NextApiRequest) => {
		const origin = req.headers.origin ?? null;

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
		const response = await handler(req);
		if (response instanceof NextResponse) {
			for (const [key, value] of Object.entries(headers)) {
				response.headers.set(key, value);
			}
		}
		return response;
	};
};
