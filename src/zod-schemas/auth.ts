import { z } from "@/lib/zod";
export const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(1),
});
export type SignupSchema = z.infer<typeof signupSchema>;

export const signInSchema = z.object({
	email: z
		.string({ required_error: "E-posta adresinizi giriniz." })
		.min(1, "E-posta adresinizi giriniz.")
		.email("Geçerli bir e-posta adresi giriniz."),
	password: z
		.string({ required_error: "Şifrenizi giriniz." })
		.min(1, "Şifrenizi giriniz.")
		.min(8, "Şifreniz en az 8 karakter olmalıdır.")
		.max(32, "Şifreniz en fazla 32 karakter olmalıdır."),
});
export type SignInSchema = z.infer<typeof signInSchema>;
