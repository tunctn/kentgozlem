import { create } from "zustand";

export const useReportMarkerStore = create<{
	expandedReportMarkerId: string | null;
	setExpandedReportMarkerId: (id: string | null) => void;
}>((set) => ({
	expandedReportMarkerId: null,
	setExpandedReportMarkerId: (id: string | null) => set({ expandedReportMarkerId: id }),
}));
