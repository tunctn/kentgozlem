import ky from "ky";
import { type NextRequest, NextResponse } from "next/server";
import { toast } from "sonner";

export const api = ky.create({
	prefixUrl: "/api",
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (!response.ok) {
					const body = (await response.json()) as unknown as { message?: string };
					if (body?.message) {
						toast.error(body.message);
					} else {
						// Show generic error toast for unknown error
						toast.error("An error occurred while making the API request");
					}
				}
			},
		],
	},
});

export class ApiError extends Error {
	public status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export const withErrorHandler = <T>(fn: (req: NextRequest) => Promise<T>) => {
	return async (req: Request) => {
		try {
			return await fn(req as NextRequest);
		} catch (error) {
			if (error instanceof ApiError) {
				return NextResponse.json({ message: error.message }, { status: error.status });
			}
			console.error("Internal server error:", error);
			return NextResponse.json({ message: "Internal server error" }, { status: 500 });
		}
	};
};
