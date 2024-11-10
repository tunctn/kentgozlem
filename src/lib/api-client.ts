import ky from "ky";
import { toast } from "sonner";

export const api = ky.create({
	prefixUrl: "/api",
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (!response.ok) {
					const body = (await response.json()) as unknown as { message?: string };
					if (body?.message) {
						toast.error(body.message);
					} else {
						// Show generic error toast for unknown error
						toast.error("An error occurred while making the API request");
					}
				}
			},
		],
	},
});
