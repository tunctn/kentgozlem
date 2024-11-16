import { z } from "zod";

export const addressSearchSchema = z.object({
	lat: z.coerce.number(),
	lng: z.coerce.number(),
});
export type AddressSearchPayload = z.infer<typeof addressSearchSchema>;
export type AddressSearchResponse = {
	place_id: string;
	licence: string;
	osm_type: string;
	osm_id: string;
	lat: string;
	lon: string;
	place_rank: string;
	category: string;
	type: string;
	importance: string;
	addresstype: string;
	display_name: string;
	name: string;
	address: {
		road?: string;
		village?: string;
		state_district?: string;
		state?: string;
		postcode?: string;
		city?: string;
		city_district?: string;
		house_number?: string;
		suburb?: string;
		country?: string;
		country_code?: string;
	};
	boudingbox: [string, string, string, string];
};
