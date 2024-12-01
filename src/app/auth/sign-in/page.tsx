"use client";
import { Separator } from "@/components/ui/separator";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { GoogleIcon } from "../google-icon";
import { ProviderAuthButton } from "../provider-auth-button";

export default function SignInPage() {
	return (
		<div>
			<h2 className="text-2xl font-bold text-center">Giriş Yap</h2>

			<div className="mt-5 flex flex-col gap-2">
				<ProviderAuthButton className="w-full flex items-center gap-2" provider="google">
					<GoogleIcon size={20} />
					Google ile devam et
				</ProviderAuthButton>

				<ProviderAuthButton
					className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground"
					provider="login-with-email"
				>
					E-posta ile devam et <MoveRight />
				</ProviderAuthButton>
			</div>
			<Separator className="my-5" text="veya" />

			<div className="text-xs justify-center text-muted-foreground flex items-center gap-1 mt-5">
				<Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-foreground">
					Hesabınız yok mu? Kayıt ol
				</Link>
			</div>
		</div>
	);
}
