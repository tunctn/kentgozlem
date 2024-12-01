"use client";
import { Combobox } from "@/components/ui/combobox";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserStore } from "@/components/user-store";
import { useCategories } from "@/lib/api/use-categories";
import { cn } from "@/lib/utils";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { NewCategoryModal } from "../new-category-modal";

export const CategorySelect = () => {
	const { user } = useUserStore();
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
						<Combobox
							key={categories.map((c) => c.id).join("-")}
							initialValue={field.value}
							{...field}
							empty={
								user?.role === "admin" ? (
									<NewCategoryModal
										key={searchValue}
										label={searchValue}
										onSuccess={onCategoryAdd}
									/>
								) : (
									<div>Kategori bulunamadı.</div>
								)
							}
							placeholder="Kategori seçin"
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
								searchLabel: category.name,
							}))}
							commandInputProps={{
								value: searchValue,
								onValueChange: setSearchValue,
							}}
							commandEmptyProps={{
								className: cn("", {
									"p-0": user?.role === "admin",
								}),
							}}
							isLoading={isCategoriesPending}
							searchPlaceholder="Kategori ara..."
						/>

						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};
