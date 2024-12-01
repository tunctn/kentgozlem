import { getInitialMapConfig } from "@/utils/get-initial-map-config";
import AuthLayoutWrapper from "./layout-wrapper";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
	const initialMapConfig = await getInitialMapConfig();

	return <AuthLayoutWrapper initialMapConfig={initialMapConfig}>{children}</AuthLayoutWrapper>;
}
