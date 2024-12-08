import type { CreateReportPayload, CreateReportResponse } from "@/zod-schemas/reports";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api-client";
import { QUERY_KEYS } from "./keys";

export const useSubmitReport = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: [QUERY_KEYS.REPORTS],
		mutationFn: (payload: CreateReportPayload) => {
			return api.post<CreateReportResponse>("reports", { json: payload }).json();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
		},
	});
};
