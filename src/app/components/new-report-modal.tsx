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
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/components/user-store";
import { useAddressSearch } from "@/lib/api/use-address-search";
import { useCategories } from "@/lib/api/use-categories";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/zod-schemas/countries";
import { type CreateReportPayload, createReportSchema } from "@/zod-schemas/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandLoading } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, Upload, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { NewCategoryModal } from "./new-category-modal";

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
	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 200 : -200,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 200 : -200,
			opacity: 0,
		}),
	};

	const [[page, direction], setPage] = useState([1, 0]);

	const paginate = (newDirection: number) => {
		const newPage = page + newDirection;
		if (newPage < 1 || newPage > 3) return;
		setPage([newPage, newDirection]);
	};

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
			house_number: "",
			suburb: "",
			is_verified: false,
			status: "pending",
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

	const renderPageContent = () => {
		switch (page) {
			case 1:
				return <AddressForm />;
			case 2:
				return <DetailsForm />;
			case 3:
				return <ImagesForm />;
		}
	};

	return (
		<Form {...form}>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>

				<DialogContent className="overflow-hidden">
					<DialogHeader>
						<DialogTitle>Bildirim Oluştur</DialogTitle>
						<DialogDescription>
							{page === 1 && "Konum ve kategori bilgilerini girin"}
							{page === 2 && "Detaylı açıklama ekleyin"}
							{page === 3 && "Fotoğraf ekleyin"}
						</DialogDescription>
					</DialogHeader>

					<div className="relative" style={{ height: 200 }}>
						<AnimatePresence mode="sync" custom={direction} initial={false}>
							<motion.div
								key={page}
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									x: { type: "spring", stiffness: 400, damping: 35 },
									opacity: { duration: 0.15 },
								}}
								className="absolute w-full"
							>
								{renderPageContent()}
							</motion.div>
						</AnimatePresence>
					</div>

					<div className="flex justify-between mt-4">
						<Button variant="outline" onClick={() => paginate(-1)} disabled={page === 1}>
							Geri
						</Button>
						<Button
							onClick={() => {
								if (page === 3) {
									// Submit form
									form.handleSubmit((data) => {
										// Handle form submission
										console.log(data);
									})();
								} else {
									paginate(1);
								}
							}}
						>
							{page === 3 ? "Gönder" : "İleri"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Form>
	);
};

const ImagePlaceholder = memo(
	({
		index,
		isDragActive,
		files,
		onRefresh,
	}: {
		index: number;
		isDragActive: boolean;
		files: File[];
		onRefresh: (index: number) => void;
	}) => {
		const file = files[index];
		return (
			<div
				data-dragging={isDragActive}
				className={cn(
					"w-[107px] relative ease-in-out aspect-square flex-shrink-0 transition-all cursor-pointer shadow-lg dark:shadow-white/5 bg-background rounded-[18px]",
					{
						"z-[1] rotate-[7deg] hover:rotate-[12deg] translate-x-[-3px] data-[dragging=true]:translate-x-[150px]":
							index === 0,
						"z-[2] rotate-[-4deg] hover:rotate-[4deg] translate-x-[-30px] data-[dragging=true]:translate-x-[60px]":
							index === 1,
						"z-[6] rotate-[5deg] hover:rotate-[-5deg] translate-x-[-40px] data-[dragging=true]:translate-x-[-30px]":
							index === 2,
						"z-[4] rotate-[-5deg] hover:rotate-[10deg] translate-x-[-60px] data-[dragging=true]:translate-x-[-120px]":
							index === 3,
						"z-[3] rotate-[10deg] hover:rotate-[15deg] translate-x-[-70px] data-[dragging=true]:translate-x-[-210px]":
							index === 4,
					},
				)}
				style={{ transitionDuration: "400ms" }}
			>
				<div className="w-full h-full border border-muted-foreground/30 rounded-[17px] ">
					<div className="w-full h-full rounded-2xl overflow-hidden border-4 border-muted-foreground/[15%]">
						<div className="w-full h-full bg-gradient-to-b from-muted-foreground/10 border border-muted-foreground/[15%] rounded-lg to-muted-foreground/5">
							{file ? (
								<button
									type="button"
									className="w-full h-full group"
									onClick={(e) => {
										e.stopPropagation(); // Prevent triggering the dropzone
										onRefresh(index);
									}}
								>
									<img
										src={URL.createObjectURL(file)}
										alt={`Preview ${index}`}
										className="w-full h-full object-cover"
									/>
									<div className="opacity-0 group-hover:opacity-100 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all">
										<X className="w-4 h-4 text-muted-foreground" />
									</div>
								</button>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Upload className="w-5 h-5 text-muted-foreground/20" />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.isDragActive === nextProps.isDragActive &&
			prevProps.files[prevProps.index] === nextProps.files[nextProps.index]
		);
	},
);

ImagePlaceholder.displayName = "ImagePlaceholder";

const ImagesForm = () => {
	const form = useFormContext<CreateReportPayload>();
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (files.length + acceptedFiles.length > 5) {
				toast.error("En fazla 5 dosya seçilebilir.");
			} else {
				setFiles((prev) => [...prev, ...acceptedFiles]);
			}
		},
		[files.length],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
		},
		maxFiles: 5,
		maxSize: 5 * 1024 * 1024, // 5MB
		minSize: 1 * 1024, // 1KB
		multiple: true,
		onDropRejected: (errors) => {
			const firstError = errors[0];
			const errorCode = firstError.errors[0].code as ErrorCode;

			if (errorCode === ErrorCode.FileInvalidType) {
				toast.error("Dosya tipi desteklenmiyor. Lütfen resim dosyaları seçin.");
			} else if (errorCode === ErrorCode.FileTooLarge) {
				toast.error("Dosya boyutu 5MB'yi aştığından dolayı yüklenemedi.");
			} else if (errorCode === ErrorCode.TooManyFiles) {
				toast.error("En fazla 5 dosya seçilebilir.");
			} else if (errorCode === ErrorCode.FileTooSmall) {
				toast.error("Dosya boyutu 1KB'dan küçük olamaz.");
			} else {
				toast.error("Bir hata oluştu. Lütfen başka bir dosya seçin.");
			}
		},
	});

	const onRefresh = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col gap-3" {...getRootProps()}>
			<div className="flex">
				<input {...getInputProps()} />
				<ImagePlaceholder
					index={0}
					isDragActive={isDragActive}
					files={files}
					onRefresh={onRefresh}
				/>
				<ImagePlaceholder
					index={1}
					isDragActive={isDragActive}
					files={files}
					onRefresh={onRefresh}
				/>
				<ImagePlaceholder
					index={2}
					isDragActive={isDragActive}
					files={files}
					onRefresh={onRefresh}
				/>
				<ImagePlaceholder
					index={3}
					isDragActive={isDragActive}
					files={files}
					onRefresh={onRefresh}
				/>
				<ImagePlaceholder
					index={4}
					isDragActive={isDragActive}
					files={files}
					onRefresh={onRefresh}
				/>
			</div>

			<div
				className={cn(
					"border-2 -mt-10 h-[140px] border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
					isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
				)}
			>
				<p className="text-sm text-muted-foreground mt-14">
					Fotoğrafları sürükleyip bırakın veya tıklayıp seçin
				</p>
			</div>
		</div>
	);
};

const DetailsForm = () => {
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

const AddressForm = () => {
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
	);
};

const CategorySelect = () => {
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
										<CommandEmpty
											className={cn("", {
												"p-0": user?.role === "admin",
											})}
										>
											{user?.role === "admin" ? (
												<NewCategoryModal
													key={searchValue}
													label={searchValue}
													onSuccess={onCategoryAdd}
												/>
											) : (
												<div>Kategori bulunamadı.</div>
											)}
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
