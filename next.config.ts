import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const { NEXT_PUBLIC_STORAGE_URL } = process.env;
if (!NEXT_PUBLIC_STORAGE_URL) {
	throw new Error("NEXT_PUBLIC_STORAGE_URL is not set");
}

const asUrl = new URL(NEXT_PUBLIC_STORAGE_URL);
const hostname = asUrl.hostname;

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
				hostname,
				pathname: "/**",
			},
		],
	},
};
// https://nextjs.org/docs/app/building-your-application/configuring/mdx
const withMDX = createMDX({
	// Add markdown plugins here, as desired
});
export default withMDX(nextConfig);
