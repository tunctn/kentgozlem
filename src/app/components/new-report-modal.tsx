"use client";
import { DraggableHorizontalList } from "@/components/draggable-horizontal-list";
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
import { memo, useCallback, useEffect, useId, useState } from "react";
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
		fileId,
		index,
		isOrderDragging,
		isDropzoneDragging,
		files,
		onRefresh,
	}: {
		fileId: string;
		index: number;
		isOrderDragging: boolean;
		isDropzoneDragging: boolean;
		files: { id: string; file: File | null; order: number }[];
		onRefresh: (id: string) => void;
	}) => {
		const file = files.find((f) => f.id === fileId);
		if (!file) return null;
		return (
			<div
				data-dropzone-dragging={isDropzoneDragging}
				data-order-dragging={isOrderDragging}
				className={cn(
					"w-[107px] relative ease-in-out aspect-square flex-shrink-0 transition-all cursor-pointer shadow-lg dark:shadow-white/5 bg-background rounded-[18px]",
					{
						"rotate-[7deg] hover:rotate-[12deg]": file.order === 0,
						"rotate-[-4deg] hover:rotate-[4deg]": file.order === 1,
						"rotate-[5deg] hover:rotate-[-5deg]": file.order === 2,
						"rotate-[-5deg] hover:rotate-[10deg]": file.order === 3,
						"rotate-[10deg] hover:rotate-[15deg]": file.order === 4,

						"data-[dropzone-dragging=true]:translate-x-[170px]": file.order === 0,
						"data-[dropzone-dragging=true]:translate-x-[80px]": file.order === 1,
						"data-[dropzone-dragging=true]:translate-x-[-10px]": file.order === 2,
						"data-[dropzone-dragging=true]:translate-x-[-100px]": file.order === 3,
						"data-[dropzone-dragging=true]:translate-x-[-190px]": file.order === 4,
					},
				)}
				style={{ zIndex: file.order, transitionDuration: "400ms" }}
			>
				<div className="w-full h-full border border-muted-foreground/30 rounded-[17px] ">
					<div className="w-full h-full rounded-2xl overflow-hidden border-4 border-muted-foreground/[15%]">
						<div className="w-full h-full bg-gradient-to-b from-muted-foreground/10 border border-muted-foreground/[15%] rounded-lg to-muted-foreground/5">
							{file.file ? (
								<button
									type="button"
									className="w-full h-full group"
									disabled={isOrderDragging || isDropzoneDragging}
									onClick={(e) => {
										e.stopPropagation(); // Prevent triggering the dropzone
										onRefresh(fileId);
									}}
								>
									<img
										src={URL.createObjectURL(file.file)}
										alt={`Preview ${index}`}
										className="w-full h-full object-cover select-none pointer-events-none"
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
);

ImagePlaceholder.displayName = "ImagePlaceholder";

const ImagesForm = () => {
	const [isOrderDragging, setIsOrderDragging] = useState(false);
	const [isOrderDraggingDelayed, setIsOrderDraggingDelayed] = useState(false);

	const fileId1 = useId();
	const fileId2 = useId();
	const fileId3 = useId();
	const fileId4 = useId();
	const fileId5 = useId();

	const form = useFormContext<CreateReportPayload>();
	const [files, setFiles] = useState<{ id: string; file: File | null; order: number }[]>([
		{
			id: fileId1,
			file: null,
			order: 0,
		},
		{
			id: fileId2,
			file: null,
			order: 1,
		},
		{
			id: fileId3,
			file: null,
			order: 2,
		},
		{
			id: fileId4,
			file: null,
			order: 3,
		},
		{
			id: fileId5,
			file: null,
			order: 4,
		},
	]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const existingFiles = files.filter((f) => f.file !== null);

			if (existingFiles.length + acceptedFiles.length > 5) {
				return toast.error("En fazla 5 dosya seçilebilir.");
			}

			setFiles((prev) => {
				const newFiles = [...prev];
				let filesAdded = 0;

				// Find empty slots and fill them
				for (let i = 0; i < newFiles.length && filesAdded < acceptedFiles.length; i++) {
					if (newFiles[i].file === null) {
						newFiles[i] = {
							id: newFiles[i].id,
							file: acceptedFiles[filesAdded],
							order: i,
						};
						filesAdded++;
					}
				}

				return newFiles;
			});
		},
		[files],
	);

	const {
		getRootProps,
		getInputProps,
		isDragActive: isDropzoneDragActive,
	} = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
		},
		maxFiles: 5,
		maxSize: 5 * 1024 * 1024, // 5MB
		minSize: 1 * 1024, // 1KB
		multiple: true,
		noClick: isOrderDraggingDelayed,
		noDrag: isOrderDraggingDelayed,
		disabled: isOrderDraggingDelayed,
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

	const onRefresh = (id: string) => {
		setFiles((prev) => prev.map((file, i) => (file.id === id ? { ...file, file: null } : file)));
	};
	const handleOnDragEnd = (items: { id: string; order: number }[]) => {
		setIsOrderDragging(false);
		setTimeout(() => {
			setIsOrderDraggingDelayed(false);
		}, 400);

		const updatedInputs = files.map((input) => {
			const newField = {
				...input,
			};

			const newOrder = items.findIndex((item) => item.id === newField.id);
			if (newOrder === -1) return null;

			return {
				...newField,
				order: newOrder,
			};
		});

		setFiles(
			updatedInputs.filter((input) => input !== null) as {
				id: string;
				file: File | null;
				order: number;
			}[],
		);
	};

	useEffect(() => {
		// Change cursor when dragging compass
		if (isOrderDragging || isDropzoneDragActive) {
			document.body.classList.add("grabbing");
		} else {
			document.body.classList.remove("grabbing");
		}
	}, [isOrderDragging, isDropzoneDragActive]);

	return (
		<div className="flex flex-col gap-3" {...getRootProps()}>
			<input {...getInputProps()} />
			<div>
				<DraggableHorizontalList
					key={files.map((_, index) => index).join(",")}
					onDragStart={() => {
						setIsOrderDragging(true);
						setIsOrderDraggingDelayed(true);
					}}
					onDragEnd={handleOnDragEnd}
					itemWidth={90}
					items={files.map((file, index) => ({
						id: file.id,
						render: (bind) => {
							return (
								<div key={file.id} {...bind} className="touch-none">
									<ImagePlaceholder
										index={index}
										isOrderDragging={isOrderDraggingDelayed}
										isDropzoneDragging={isDropzoneDragActive}
										files={files}
										fileId={file.id}
										onRefresh={onRefresh}
									/>
								</div>
							);
						},
					}))}
				/>
			</div>

			<div
				className={cn(
					"border-2 mt-[40px] h-[160px] border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
					isDropzoneDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
				)}
			>
				<p className="text-sm text-muted-foreground mt-[75px]">
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
