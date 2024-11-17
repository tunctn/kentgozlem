"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter } from "@/components/ui/dialog";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { type SignupSchema, signupSchema } from "@/zod-schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";

const useSignUp = () => {
	return useMutation({
		mutationFn: async (data: SignupSchema) => {
			return await api.post("auth/signup", { json: data }).json();
		},
	});
};

export function EmailSignUpForm() {
	const form = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});

	const signupMutation = useSignUp();
	const onSubmit = form.handleSubmit((data) => {
		signupMutation.mutate(data, {
			onSuccess: () => {
				window.location.href = "/";
			},
		});
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ad Soyad</FormLabel>
							<FormControl>
								<Input placeholder="Ad Soyad" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
					<Button className="w-full" variant="outline" type="submit">
						<Mail size={16} />
						E-posta ile kayıt ol
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
