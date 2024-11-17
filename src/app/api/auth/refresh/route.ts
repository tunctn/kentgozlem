import { apiRoute } from "@/lib/server";
import { revalidateSession } from "@/server/revalidate-session";
import { NextResponse } from "next/server";

export const POST = apiRoute({}).protected(async (req) => {
	await revalidateSession();
	return NextResponse.json({ message: "Refreshed" }, { status: 201 });
});
