import { db } from "@/db/db";
import { type NewReportUpvote, reportUpvotes, reports } from "@/db/schema";
import { faker } from "@faker-js/faker";

const generateUpvoteCount = () => {
	// Random number between 0 and 1
	const rand = Math.random();

	// Exponential distribution to make lower numbers more likely
	// This will make:
	// ~50% of reports have 1-2 upvotes
	// ~30% have 3-5 upvotes
	// ~15% have 6-10 upvotes
	// ~5% have 11-100 upvotes
	if (rand < 0.5) {
		return faker.number.int({ min: 1, max: 2 });
	}
	if (rand < 0.8) {
		return faker.number.int({ min: 3, max: 5 });
	}
	if (rand < 0.95) {
		return faker.number.int({ min: 6, max: 10 });
	}
	return faker.number.int({ min: 11, max: 100 });
};

export const seedReportUpvotes = async () => {
	const CHUNK_SIZE = 5000;

	// Get all report IDs
	const reportIds = await db
		.select({ id: reports.id })
		.from(reports)
		.then((rows) => rows.map((row) => row.id));

	// Process reports in chunks
	for (let i = 0; i < reportIds.length; i += CHUNK_SIZE) {
		console.log(
			`Processing reports chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(reportIds.length / CHUNK_SIZE)}`,
		);

		const reportIdsChunk = reportIds.slice(i, i + CHUNK_SIZE);
		const chunkUpvotes: NewReportUpvote[] = [];

		// Generate upvotes for each report in this chunk
		for (const reportId of reportIdsChunk) {
			const upvoteCount = generateUpvoteCount();
			const reportUpvotes = Array.from({ length: upvoteCount }, () => ({
				id: faker.string.uuid(),
				created_at: faker.date.past(),
				updated_at: faker.date.recent(),
				created_by_id: "019335a4-a276-7708-9db6-77f7c4b3abb1",
				report_id: reportId,
			}));
			chunkUpvotes.push(...reportUpvotes);
		}

		// Insert upvotes for this chunk of reports
		for (let j = 0; j < chunkUpvotes.length; j += CHUNK_SIZE) {
			console.log(
				`Inserting upvotes sub-chunk ${j / CHUNK_SIZE + 1} of ${Math.ceil(chunkUpvotes.length / CHUNK_SIZE)}`,
			);
			const insertChunk = chunkUpvotes.slice(j, j + CHUNK_SIZE);
			await db.insert(reportUpvotes).values(insertChunk);
		}
	}
};
