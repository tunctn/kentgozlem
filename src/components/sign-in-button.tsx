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
			<Button type="submit">Sign In</Button>
		</form>
	);
}
