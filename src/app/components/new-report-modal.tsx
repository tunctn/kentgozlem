"use client";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/api/keys";
import { useAddressSearch } from "@/lib/api/use-address-search";
import { useCategories } from "@/lib/api/use-categories";
import { cn } from "@/lib/utils";
import {
	type CreateCategoryPayload,
	type CreateCategoryResponse,
	createCategorySchema,
} from "@/zod-schemas/categories";
import { COUNTRIES } from "@/zod-schemas/countries";
import { type CreateReportPayload, createReportSchema } from "@/zod-schemas/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

interface NewReportModalProps {
	trigger: React.ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	lat: number;
	lng: number;
}
export const NewReportModal = ({
	trigger,
	isOpen,
	onOpenChange,
	lat,
	lng,
}: NewReportModalProps) => {
	const { data: address, isPending: isAddressSearchPending } = useAddressSearch({ lat, lng });
	const isPending = isAddressSearchPending;

	const form = useForm<CreateReportPayload>({
		resolver: zodResolver(createReportSchema),
		defaultValues: {
			lat,
			lng,
			street: "",
			city: "",
			postal_code: "",
			country: "",
			description: "",
			category_id: "",
			is_verified: false,
			status: "pending",
			house_number: "",
			suburb: "",
		},
		disabled: isPending,
	});

	useEffect(() => {
		if (isAddressSearchPending) return;
		if (!address?.address) return;

		const street = address.address.road ?? "";
		const suburb = address.address.suburb ?? "";
		const houseNumber = address.address.house_number ?? "";
		const city = address.address.city ?? "";
		const postalCode = address.address.postcode ?? "";
		const country = address.address.country_code?.toUpperCase() ?? "";

		form.reset({
			...form.getValues(),
			street,
			suburb,
			house_number: houseNumber,
			city,
			postal_code: postalCode,
			country,
		});
	}, [address?.address, form.reset, form.getValues, isAddressSearchPending]);

	return (
		<Form {...form}>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>Bildirim Oluştur</DialogTitle>
						<DialogDescription>
							Bu bildirim, seçilen konuma göre oluşturulacaktır.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-3">
						<CategorySelect />
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="street"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Sokak</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="house_number"
								render={({ field }) => (
									<FormItem className="w-1/5">
										<FormLabel>Ev No</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="suburb"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Mahalle</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="postal_code"
								render={({ field }) => (
									<FormItem className="w-2/5">
										<FormLabel>Posta Kodu</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Şehir</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Ülke</FormLabel>
										<FormControl>
											<Select {...field} onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Ülke seçin" />
												</SelectTrigger>
												<SelectContent>
													{COUNTRIES.map((country) => (
														<SelectItem key={country.code} value={country.code}>
															{country.emoji} {country.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Form>
	);
};

const CategorySelect = () => {
	const { data, isPending: isCategoriesPending } = useCategories();
	const form = useFormContext<CreateReportPayload>();
	const [searchValue, setSearchValue] = useState("");

	if (isCategoriesPending) return null;
	const categories = data ?? [];

	return (
		<FormField
			control={form.control}
			name="category_id"
			render={({ field }) => {
				const onCategoryAdd = (categoryId: string) => {
					setSearchValue("");
					field.onChange(categoryId);
				};

				return (
					<FormItem>
						<FormLabel>Kategori</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-between",
											!field.value && "text-muted-foreground",
										)}
									>
										{categories.find((category) => category.id === field.value)?.name ??
											"Kategori seçin"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
								<Command>
									<CommandInput
										placeholder="Kategori ara..."
										onValueChange={setSearchValue}
										value={searchValue}
									/>
									<CommandList>
										<CommandEmpty>
											<NewCategoryButton label={searchValue} onSuccess={onCategoryAdd} />
										</CommandEmpty>
										<CommandGroup>
											{isCategoriesPending && <CommandLoading>Yükleniyor...</CommandLoading>}

											{categories.map((category) => (
												<CommandItem
													value={category.name}
													key={category.id}
													onSelect={() => field.onChange(category.id)}
												>
													{category.name}
													<Check
														className={cn(
															"ml-auto",
															category.id === field.value ? "opacity-100" : "opacity-0",
														)}
													/>
												</CommandItem>
											))}
											<CommandSeparator />
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};

const useNewCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateCategoryPayload) => {
			return await api.post<CreateCategoryResponse>("categories", { json: data }).json();
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
		},
	});
};

const NewCategoryButton = ({
	label,
	onSuccess,
}: {
	label: string;
	onSuccess: (categoryId: string) => void;
}) => {
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
					className="text-muted-foreground cursor-pointer"
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
