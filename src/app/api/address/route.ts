import { apiRoute } from "@/lib/server";
import { type AddressSearchResponse, addressSearchSchema } from "@/zod-schemas/address-search";
import ky from "ky";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const GET = apiRoute({
	query: addressSearchSchema,
}).protected(async (req) => {
	const lat = req.query.lat;
	const lng = req.query.lng;

	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("lon", lng.toString());
	url.searchParams.set("format", "jsonv2");

	try {
		const result = await ky.get<AddressSearchResponse>(url.toString()).json();
		return NextResponse.json(result);
	} catch (error) {
		throw new ApiError(500, "Failed to fetch address");
	}
});
