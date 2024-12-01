"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/api/keys";
import {
	type CreateCategoryPayload,
	type CreateCategoryResponse,
	createCategorySchema,
} from "@/zod-schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const useNewCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateCategoryPayload) => {
			return await api.post<CreateCategoryResponse>("categories", { json: data }).json();
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
		},
	});
};

export const NewCategoryModal = ({
	label,
	onSuccess,
}: {
	label: string;
	onSuccess: (categoryId: string) => void;
}) => {
	const queryClient = useQueryClient();

	const newCategoryMutation = useNewCategory();
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<CreateCategoryPayload>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: label,
			description: "",
		},
	});

	const onSubmit = (data: CreateCategoryPayload) => {
		newCategoryMutation.mutate(data, {
			onSuccess: (data) => {
				onSuccess?.(data.id);
				setIsOpen(false);
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="text-muted-foreground cursor-pointer w-full border-0 h-[70px] rounded-[inherit]"
					disabled={label.length === 0}
				>
					<Plus className="mr-2 h-4 w-4" />
					Ekle: {label}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Yeni Kategori Ekle</DialogTitle>
					<DialogDescription>
						Yeni bir kategori eklemek için aşağıdaki formu doldurun.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Kategori Adı</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Açıklama</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								İptal
							</Button>
							<Button type="submit" disabled={newCategoryMutation.isPending}>
								{newCategoryMutation.isPending ? "Ekleniyor..." : "Ekle"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
