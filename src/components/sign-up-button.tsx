"use client";

import { type SignupSchema, signupSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Input } from "./ui/input";

const useSignUp = () => {
	return useMutation({
		mutationFn: async (data: SignupSchema) => {
			return await api.post("auth/signup", { json: data }).json();
		},
	});
};

export function SignUpButton() {
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
		signupMutation.mutate(data, {});
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="glass">Kayıt Ol</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Kayıt Ol</DialogTitle>
					<DialogDescription>Kayıt olmak için aşağıdaki bilgileri doldurun.</DialogDescription>
				</DialogHeader>

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
							<Button className="w-full" type="submit">
								Kent Gözlem'e Kayıt Ol
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
