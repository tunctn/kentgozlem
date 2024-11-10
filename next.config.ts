import type { NextConfig } from "next";

const { NEXT_PUBLIC_STORAGE_URL } = process.env;

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: `${NEXT_PUBLIC_STORAGE_URL}`.replace("https://", "").replace("http://", ""),
			},
		],
	},
};

export default nextConfig;
