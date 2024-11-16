"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter } from "@/components/ui/dialog";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { type SignInSchema, signInSchema } from "@/lib/zod";
import { useMutation } from "@tanstack/react-query";

const useSignIn = () => {
	return useMutation({
		mutationFn: async (data: SignInSchema) => {
			return await api.post("auth/signin", { json: data }).json();
		},
	});
};

export function SignInForm() {
	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signinMutation = useSignIn();
	const onSubmit = form.handleSubmit((data) => {
		signinMutation.mutate(data, {
			onSuccess: (data) => {
				window.location.href = "/";
			},
		});
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-posta</FormLabel>
							<FormControl>
								<Input placeholder="E-posta" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Şifre</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter>
					<Button className="w-full" type="submit">
						Giriş Yap
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
