"use client";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddressSearch } from "@/lib/api/use-address-search";
import { COUNTRIES } from "@/zod-schemas/countries";
import { type CreateReportPayload, createReportSchema } from "@/zod-schemas/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
	const { data, isPending } = useAddressSearch({ lat, lng });

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
		},
		disabled: isPending,
	});

	useEffect(() => {
		if (isPending) return;
		if (!data?.address) return;

		const street = data.address.road ?? "";
		const suburb = data.address.suburb ?? "";
		const houseNumber = data.address.house_number ?? "";
		const city = data.address.city ?? "";
		const postalCode = data.address.postcode ?? "";
		const country = data.address.country_code?.toUpperCase() ?? "";

		form.reset({
			...form.getValues(),
			street,
			suburb,
			house_number: houseNumber,
			city,
			postal_code: postalCode,
			country,
		});
	}, [data?.address, form.reset, form.getValues, isPending]);

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
