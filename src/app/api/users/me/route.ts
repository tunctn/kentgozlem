import { apiRoute } from "@/lib/server";
import { getUser } from "@/server/get-user";
import { NextResponse } from "next/server";

export const GET = apiRoute({}).protected(async () => {
	const response = await getUser();
	return NextResponse.json(response);
});
