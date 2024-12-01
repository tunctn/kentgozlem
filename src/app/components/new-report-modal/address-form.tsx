"use client";
import { Combobox } from "@/components/ui/combobox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { convertToEnglish } from "@/utils/convert-to-english";
import { COUNTRIES } from "@/zod-schemas/countries";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import { useFormContext } from "react-hook-form";

export const AddressForm = () => {
	const form = useFormContext<CreateReportPayload>();

	return (
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
								<Combobox
									options={COUNTRIES.map((country) => ({
										label: `${country.emoji} ${country.name}`,
										value: country.code,
										searchLabel: `${country.emoji} ${country.name} ${convertToEnglish(country.name)}`,
									}))}
									{...field}
									empty="Ülke bulunamadı"
									placeholder="Ülke seçin"
									searchPlaceholder="Ülke ara..."
									initialValue={field.value}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
