import type { GetReportsQuery, GetReportsResponse } from "@/server/reports/get-reports";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import { QUERY_KEYS } from "./keys";

export const useReports = ({ query }: { query: GetReportsQuery | null }) => {
	return useQuery({
		queryKey: [QUERY_KEYS.REPORTS, query],
		queryFn: () => {
			if (!query) return;
			return api.get<GetReportsResponse>("reports", { searchParams: query }).json();
		},
		enabled: !!query,
	});
};
