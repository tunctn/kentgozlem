// src/env.mjs
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		ALLOWED_CORS_ORIGINS: z.string().min(1),

		DATABASE_URL: z.string().url(),
		DATABASE_SSL: z.enum(["true", "false"]),

		S3_ACCESS_KEY_ID: z.string().min(1),
		S3_SECRET_ACCESS_KEY: z.string().min(1),
		S3_ENDPOINT: z.string().url(),
		S3_REGION: z.string().min(1),
	},
	clientPrefix: "NEXT_PUBLIC_",
	client: {
		NEXT_PUBLIC_MAPBOX_API_KEY: z.string().min(1),
		NEXT_PUBLIC_STORAGE_URL: z.string().url(),
	},
	runtimeEnv: {
		ALLOWED_CORS_ORIGINS: process.env.ALLOWED_CORS_ORIGINS,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_SSL: process.env.DATABASE_SSL,
		NEXT_PUBLIC_MAPBOX_API_KEY: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
		S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
		S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
		S3_ENDPOINT: process.env.S3_ENDPOINT,
		S3_REGION: process.env.S3_REGION,
		NEXT_PUBLIC_STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL,
	},
});
export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEV = NODE_ENV === "development";
