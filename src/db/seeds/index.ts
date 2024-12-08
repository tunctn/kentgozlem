import { seedReportUpvotes } from "./report-upvotes";
import { seedReports } from "./reports";

export const seed = async () => {
	await seedReports();
	await seedReportUpvotes();
};
