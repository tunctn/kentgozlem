import { signIn } from "@/lib/auth";
import { Button } from "./ui/button";

export function SignInButton() {
	return (
		<form
			action={async (formData) => {
				"use server";
				await signIn();
			}}
		>
			<Button variant="glass" type="submit">
				Giriş Yap
			</Button>
		</form>
	);
}
