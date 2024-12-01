"use client";
import { cn } from "@/lib/utils";
import { Squircle } from "@squircle-js/react";
import { Upload, X } from "lucide-react";
import { memo } from "react";

export const ImagePlaceholder = memo(
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
				className="relative group"
				{...(file.file ? { onClick: (e) => e.stopPropagation() } : {})}
				{...(file.file ? { onKeyDown: (e) => e.stopPropagation() } : {})}
			>
				<div
					data-dropzone-dragging={isDropzoneDragging}
					data-order-dragging={isOrderDragging}
					className={cn(
						"shadow-lg rounded-[18px] w-[107px] relative ease-in-out aspect-square shrink-0 transition-all rounded-[24px]",
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

							"cursor-pointer": !file.file,
						},
					)}
					style={{ zIndex: file.order, transitionDuration: "400ms" }}
				>
					{/* Background provider */}
					<Squircle cornerRadius={24} cornerSmoothing={1} className="h-full w-full bg-background">
						{/* First border */}
						<Squircle
							cornerRadius={24}
							cornerSmoothing={1}
							className="h-full w-full bg-foreground/15 p-px"
						>
							{/* First border content, background provider */}
							<Squircle
								cornerRadius={23}
								cornerSmoothing={1}
								className="h-full w-full bg-background/70 p-[5px]"
							>
								<Squircle
									cornerRadius={18}
									cornerSmoothing={1}
									className="h-full w-full bg-foreground/7 p-px"
								>
									<Squircle
										cornerRadius={17}
										cornerSmoothing={1}
										className="h-full w-full bg-background"
									>
										<Squircle
											cornerRadius={17}
											cornerSmoothing={1}
											className="h-full w-full bg-linear-to-b from-muted-foreground/10 to-muted-foreground/5 "
										>
											{file.file ? (
												<Squircle cornerRadius={16} cornerSmoothing={1} asChild>
													<img
														src={URL.createObjectURL(file.file)}
														alt={`Preview ${index}`}
														className="w-full h-full object-cover select-none pointer-events-none"
													/>
												</Squircle>
											) : (
												<div className="w-full h-full flex items-center justify-center opacity-18 group-hover:opacity-100 transition-opacity">
													<Upload className="w-5 h-5 text-muted-foreground" />
												</div>
											)}
										</Squircle>
									</Squircle>
								</Squircle>
							</Squircle>
						</Squircle>
					</Squircle>
				</div>
				{file.file && (
					<button
						type="button"
						className="absolute w-full h-[50px] top-0 z-[-1] -translate-y-[40px] flex items-center justify-center pl-5 left-0 hover:opacity-100 group-hover:opacity-80 opacity-20 transition-opacity"
						disabled={isOrderDragging || isDropzoneDragging}
						onClick={(e) => {
							e.stopPropagation(); // Prevent triggering the dropzone
							onRefresh(fileId);
						}}
					>
						<X className="w-4 h-4 text-muted-foreground" />
					</button>
				)}
			</div>
		);
	},
);

ImagePlaceholder.displayName = "ImagePlaceholder";
