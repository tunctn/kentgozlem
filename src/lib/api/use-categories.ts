import type { GetCategoriesResponse } from "@/zod-schemas/categories";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import { QUERY_KEYS } from "./keys";

export const useCategories = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.CATEGORIES],
		queryFn: () => api.get<GetCategoriesResponse>("categories").json(),
	});
};
