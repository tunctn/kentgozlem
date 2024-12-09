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
import { Form } from "@/components/ui/form";
import { useAddressSearch } from "@/lib/api/use-address-search";
import { useSubmitReport } from "@/lib/api/use-submit-report";
import { useUploadImage } from "@/lib/api/use-upload-image";
import { cn } from "@/lib/utils";
import { type CreateReportPayload, createReportSchema } from "@/zod-schemas/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddressForm } from "./address-form";
import { DetailsForm } from "./details-form";
import { ImagesForm } from "./images-form";

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

	const [isTransitioning, setIsTransitioning] = useState(false);

	const [[page, direction], setPage] = useState([1, 0]);

	const paginate = (newDirection: number) => {
		const newPage = page + newDirection;
		if (newPage < 1 || newPage > 3) return;
		setPage([newPage, newDirection]);
	};

	const { data: address, isPending: isAddressSearchPending } = useAddressSearch({ lat, lng });
	const isPending = isAddressSearchPending;

	const [imageFiles, setImageFiles] = useState<Map<string, File> | undefined>();

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
			images: [],
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
				return <ImagesForm setImageFiles={setImageFiles} />;
		}
	};

	const uploadImage = useUploadImage();
	const submitReport = useSubmitReport();

	const validateForm = () => {
		const errors = form.formState.errors;
		type Keys = keyof CreateReportPayload;
		const page1Fields: Keys[] = [
			"lat",
			"lng",
			"street",
			"city",
			"postal_code",
			"country",
			"house_number",
			"suburb",
		];
		const page2Fields: Keys[] = ["description", "category_id"];
		const page3Fields: Keys[] = ["images"];

		if (page1Fields.some((x) => errors[x])) return 1;
		if (page2Fields.some((x) => errors[x])) return 2;
		if (page3Fields.some((x) => errors[x])) return 3;
		return 0;
	};
	const formValidationResult = validateForm();

	const [imagesLoading, setImagesLoading] = useState(false);
	const onSubmit = () => {
		const formValidationResult = validateForm();
		if (formValidationResult !== 0) {
			setPage([formValidationResult, 1]);
			toast.error("Lütfen tüm alanları doldurun.");
			return;
		}

		if (page !== 3) {
			return paginate(1);
		}

		form.handleSubmit(async (data) => {
			if (data.images.length > 0) {
				setImagesLoading(true);
				toast.loading("Görseller yükleniyor...");
			}

			const resizedImages = await Promise.all(
				data.images.map(async (image) => {
					const imageFile = imageFiles?.get(image.field_array_id);
					if (!imageFile) throw new Error("Görsel bulunamadı.");

					const uploaded = await uploadImage.mutateAsync(imageFile);
					if (!uploaded) throw new Error("Görsel yüklenemedi.");
					return {
						...image,
						uploaded,
					};
				}),
			)
				.then((res) => {
					toast.success("Görseller yüklendi.");
					return res;
				})
				.catch((err) => {
					toast.error("Görseller yüklenirken bir hata oluştu.");
					throw err;
				})
				.finally(() => {
					setImagesLoading(false);
					toast.dismiss();
				});

			submitReport.mutate(
				{
					...data,
					images: resizedImages.map((x) => ({
						field_array_id: x.field_array_id,
						description: x.description,
						extension: x.uploaded.extension,
						file_name: x.file_name,
						height: x.uploaded.height,
						width: x.uploaded.width,
						size: x.uploaded.size,
						order: x.order,
						storage_path: x.uploaded.storage_path,
						mime_type: x.uploaded.mime_type,
					})),
				},
				{
					onSuccess: () => {
						toast.success("Bildirim başarıyla gönderildi.");
						onOpenChange(false);
						form.reset();
						setImageFiles(undefined);
					},
				},
			);
		})();
	};

	return (
		<Form {...form}>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>{trigger}</DialogTrigger>

				<DialogContent className={cn({ "overflow-hidden": isTransitioning })}>
					<DialogHeader>
						<DialogTitle>Bildirim Oluştur</DialogTitle>
						<DialogDescription>
							{page === 1 && "Konum ve kategori bilgilerini girin"}
							{page === 2 && "Detaylı açıklama ekleyin"}
							{page === 3 && "Fotoğraf ekleyin"}
						</DialogDescription>
					</DialogHeader>

					<div
						className={cn("relative transition-all duration-300 ease-in-out h-[200px]", {
							"h-[240px]": formValidationResult === 1 && page === 1,
							"h-[210px]": formValidationResult === 2 && page === 2,
							"h-[200px]": formValidationResult === 3 && page === 3,
						})}
					>
						<AnimatePresence
							mode="sync"
							custom={direction}
							initial={false}
							onExitComplete={() => {
								setIsTransitioning(false);
							}}
						>
							<motion.div
								key={page}
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								onAnimationStart={() => {
									setIsTransitioning(true);
								}}
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
						<Button onClick={onSubmit} isLoading={imagesLoading || submitReport.isPending}>
							{page === 3 ? "Gönder" : "İleri"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Form>
	);
};
