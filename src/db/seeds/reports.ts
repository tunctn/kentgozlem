import { db } from "@/db/db";
import { type NewReport, reports } from "@/db/schema";
import { REPORT_STATUS } from "@/zod-schemas/reports";
import { faker } from "@faker-js/faker";
import { categories } from "../schema/categories";

// Major cities with their coordinates and approximate population-based report counts
const MAJOR_CITIES = [
	{ name: "Istanbul", lat: 41.0082, lng: 28.9784, reports: 3000 },
	{ name: "Izmir", lat: 38.4237, lng: 27.1428, reports: 1500 },
	{ name: "London", lat: 51.5074, lng: -0.1278, reports: 3000 },
	{ name: "New York", lat: 40.7128, lng: -74.006, reports: 3000 },
	{ name: "Berlin", lat: 52.52, lng: 13.405, reports: 2000 },
	{ name: "Tokyo", lat: 35.6762, lng: 139.6503, reports: 3000 },
	{ name: "Cape Town", lat: -33.9249, lng: 18.4241, reports: 1500 },
	{ name: "Sydney", lat: -33.8688, lng: 151.2093, reports: 1500 },
	{ name: "Paris", lat: 48.8566, lng: 2.3522, reports: 2000 },
	{ name: "Moscow", lat: 55.7558, lng: 37.6173, reports: 2000 },
	{ name: "Dubai", lat: 25.2048, lng: 55.2708, reports: 1500 },
	{ name: "Singapore", lat: 1.3521, lng: 103.8198, reports: 1500 },
	{ name: "Mumbai", lat: 19.076, lng: 72.8777, reports: 2500 },
	{ name: "São Paulo", lat: -23.5505, lng: -46.6333, reports: 2500 },
	{ name: "Mexico City", lat: 19.4326, lng: -99.1332, reports: 2000 },
	{ name: "Cairo", lat: 30.0444, lng: 31.2357, reports: 2000 },
	{ name: "Lagos", lat: 6.5244, lng: 3.3792, reports: 1500 },
	{ name: "Seoul", lat: 37.5665, lng: 126.978, reports: 2000 },
	{ name: "Bangkok", lat: 13.7563, lng: 100.5018, reports: 1500 },
	{ name: "Toronto", lat: 43.6532, lng: -79.3832, reports: 1500 },
	{ name: "Ankara", lat: 39.9334, lng: 32.8597, reports: 1500 },
	{ name: "Bursa", lat: 40.1828, lng: 29.0665, reports: 1200 },
	{ name: "Antalya", lat: 36.8969, lng: 30.7133, reports: 1300 },
	{ name: "Adana", lat: 37.0, lng: 35.3213, reports: 1100 },
	{ name: "Gaziantep", lat: 37.0662, lng: 37.3833, reports: 1000 },
	{ name: "Los Angeles", lat: 34.0522, lng: -118.2437, reports: 2500 },
	{ name: "Buenos Aires", lat: -34.6037, lng: -58.3816, reports: 2000 },
	{ name: "Johannesburg", lat: -26.2041, lng: 28.0473, reports: 1500 },
	{ name: "Beijing", lat: 39.9042, lng: 116.4074, reports: 3000 },
	{ name: "Hong Kong", lat: 22.3193, lng: 114.1694, reports: 1500 },
	{ name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, reports: 2000 },
	{ name: "Madrid", lat: 40.4168, lng: -3.7038, reports: 2000 },
	{ name: "Rome", lat: 41.9028, lng: 12.4964, reports: 2000 },
	{ name: "Kuala Lumpur", lat: 3.139, lng: 101.6869, reports: 1500 },
	{ name: "Jakarta", lat: -6.2088, lng: 106.8456, reports: 2000 },
	{ name: "Lima", lat: -12.0464, lng: -77.0428, reports: 1500 },
	{ name: "Karachi", lat: 24.8607, lng: 67.0011, reports: 2500 },
	{ name: "Tehran", lat: 35.6892, lng: 51.389, reports: 2000 },
	{ name: "Vienna", lat: 48.2082, lng: 16.3738, reports: 1500 },
];

// Function to generate random coordinates within a radius
const generateRandomLocation = (centerLat: number, centerLng: number, radius: number) => {
	const r = radius * Math.sqrt(Math.random());
	const theta = Math.random() * 2 * Math.PI;

	const lat = centerLat + r * Math.cos(theta);
	const lng = centerLng + r * Math.sin(theta);

	return { lat, lng };
};

// Function to generate a report
const generateReport = (
	categoryIds: string[],
	lat: number,
	lng: number,
	cityName?: string,
): NewReport => {
	return {
		created_by_id: "019335a4-a276-7708-9db6-77f7c4b3abb1",
		created_at: faker.date.past(),
		updated_at: faker.date.recent(),

		latitude: lat.toString(),
		longitude: lng.toString(),

		category_id: faker.helpers.arrayElement(categoryIds),

		street: faker.location.street(),
		house_number: faker.number.int({ min: 1, max: 200 }).toString(),
		suburb: faker.location.county(),
		city: cityName || faker.location.city(),
		postal_code: faker.location.zipCode(),
		country: faker.location.country(),

		description: faker.lorem.paragraph(),

		is_verified: faker.datatype.boolean(),
		status: faker.helpers.arrayElement(REPORT_STATUS),
	} satisfies NewReport;
};

export const seedReports = async () => {
	const categoryIds = await db
		.select()
		.from(categories)
		.then((cats) => cats.map((c) => c.id));

	const allReports: NewReport[] = [];

	// Generate reports for major cities
	for (const city of MAJOR_CITIES) {
		const cityReports = Array.from({ length: city.reports }, () => {
			const { lat, lng } = generateRandomLocation(city.lat, city.lng, 0.1);
			return generateReport(categoryIds, lat, lng, city.name);
		});
		allReports.push(...cityReports);
	}

	// Generate 500 reports for random locations worldwide
	for (let i = 0; i < 500; i++) {
		const lat = faker.location.latitude();
		const lng = faker.location.longitude();
		allReports.push(generateReport(categoryIds, lat, lng));
	}

	// Insert in chunks to avoid memory issues
	const CHUNK_SIZE = 1000;
	for (let i = 0; i < allReports.length; i += CHUNK_SIZE) {
		console.log(
			`Inserting chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(allReports.length / CHUNK_SIZE)}`,
		);
		const chunk = allReports.slice(i, i + CHUNK_SIZE);
		await db.insert(reports).values(chunk);
		console.log(
			`Inserted chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(allReports.length / CHUNK_SIZE)}`,
		);
	}
};
