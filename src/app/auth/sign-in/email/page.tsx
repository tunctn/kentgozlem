import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { SignInForm } from "./email-sign-in-form";

export default function EmailSignInPage() {
	return (
		<div>
			<h2 className="text-2xl font-bold text-center">Giriş Yap</h2>

			<div className="mt-5">
				<SignInForm />
			</div>
			<Separator className="my-5" text="veya" />

			<div className="text-sm justify-center text-muted-foreground flex items-center gap-1 mt-5">
				<Link
					href="/auth/sign-in"
					className="underline underline-offset-4 hover:text-foreground flex items-center gap-2"
				>
					<MoveLeft size={16} /> Geri Dön
				</Link>
			</div>
		</div>
	);
}
