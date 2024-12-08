import type { GetReportResponse } from "@/server/reports/get-report";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import { QUERY_KEYS } from "./keys";

export const useReport = ({ reportId }: { reportId: string }) => {
	return useQuery({
		queryKey: [QUERY_KEYS.REPORTS, reportId],
		queryFn: () => api.get<GetReportResponse>(`reports/${reportId}`).json(),
		enabled: !!reportId,
	});
};
