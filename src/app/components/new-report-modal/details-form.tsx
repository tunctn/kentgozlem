"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import { useFormContext } from "react-hook-form";
import { CategorySelect } from "./category-select";

export const DetailsForm = () => {
	const form = useFormContext<CreateReportPayload>();
	return (
		<div className="flex flex-col gap-3">
			<CategorySelect />

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Açıklama</FormLabel>
						<FormControl>
							<Textarea {...field} className="h-full resize-none" style={{ minHeight: "120px" }} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};
