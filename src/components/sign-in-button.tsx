import { Button } from "./ui/button";

export function SignInButton() {
	return (
		<Button variant="glass" asChild>
			<a href="/auth/sign-in">Giriş Yap</a>
		</Button>
	);
}
