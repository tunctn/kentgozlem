"use client";

import { env } from "@/lib/env";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";

export const GoogleMaps = () => (
	<APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
		<GoogleMap
			style={{ width: "100vw", height: "100vh" }}
			defaultCenter={{ lat: 22.54992, lng: 0 }}
			defaultZoom={3}
			gestureHandling={"greedy"}
			disableDefaultUI={true}
		/>
	</APIProvider>
);
