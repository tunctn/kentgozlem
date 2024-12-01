"use client";
import { DraggableHorizontalList } from "@/components/draggable-horizontal-list";
import { cn } from "@/lib/utils";
import type { CreateReportPayload } from "@/zod-schemas/reports";
import { useCallback, useEffect, useId, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ImagePlaceholder } from "./image-placeholder";

export const ImagesForm = () => {
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
		<div className="flex flex-col gap-3 mt-5" {...getRootProps()}>
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
					"border-2 mt-[30px] h-[150px] border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
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
