import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const { NEXT_PUBLIC_STORAGE_URL } = process.env;

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

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
// https://nextjs.org/docs/app/building-your-application/configuring/mdx
const withMDX = createMDX({
	// Add markdown plugins here, as desired
});
export default withMDX(nextConfig);
