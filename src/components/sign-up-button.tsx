import { Button } from "./ui/button";

export function SignUpButton() {
	return (
		<Button variant="glass" asChild>
			<a href="/auth/sign-up">Kayıt Ol</a>
		</Button>
	);
}
