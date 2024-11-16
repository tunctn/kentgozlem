import type { AddressSearchResponse } from "@/zod-schemas/address-search";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import { QUERY_KEYS } from "./keys";

export const useAddressSearch = ({ lat, lng }: { lat: number; lng: number }) => {
	return useQuery({
		queryKey: [QUERY_KEYS.ADDRESS_SEARCH, lat, lng],
		queryFn: () => api.get<AddressSearchResponse>(`address?lat=${lat}&lng=${lng}`).json(),
	});
};
