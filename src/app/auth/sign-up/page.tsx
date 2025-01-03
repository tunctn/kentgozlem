"use client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { GoogleIcon } from "../google-icon";
import { ProviderAuthButton } from "../provider-auth-button";
import { EmailSignUpForm } from "./email-sign-up-form";

export default function SignUpPage() {
	return (
		<div>
			<h2 className="text-2xl font-bold text-center">Kayıt Ol</h2>
			<div className="mt-5 flex flex-col gap-2">
				<ProviderAuthButton className="w-full flex items-center gap-2" provider="google">
					<GoogleIcon size={20} />
					Google ile kayıt ol
				</ProviderAuthButton>
				<Separator className="my-5" text="veya" />
				<EmailSignUpForm />
			</div>
			<Separator className="my-5" />
			<div className="text-xs justify-center text-muted-foreground flex items-center gap-1 mt-5">
				<Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-foreground">
					Zaten hesabınız var mı? Giriş yap
				</Link>
			</div>
		</div>
	);
}
