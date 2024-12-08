"use server";

import { env } from "@/lib/env";
import { S3 } from "@/lib/s3";
import { ApiError } from "@/lib/server/error-handler";
import { toSlug } from "@/utils/to-slug";
import { IMAGE_EXTENSIONS, type ImageExtension } from "@/zod-schemas/reports";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import sharp, { type FormatEnum } from "sharp";
import { getUser } from "../get-user";

export const uploadImage = async (file: File) => {
	const { user } = await getUser();
	if (!user) throw new ApiError(401, "Kullanıcı bulunamadı.");

	const MINIMUM_QUALITY = 5;
	const MAXIMUM_FILE_SIZE = 128 * 1024; // 128KB

	const extension = file.type.split("/")[1] as ImageExtension;

	if (!IMAGE_EXTENSIONS.includes(extension)) {
		throw new ApiError(400, `Yalnızca ${IMAGE_EXTENSIONS.join(", ")} dosya türleri destekleniyor.`);
	}

	const buffer = await file.arrayBuffer();
	const image = sharp(buffer);
	let quality = 100; // Start with full quality
	let outputBuffer: Buffer;

	const metadata = await image.metadata();
	const MAX_DIMENSION = 3840;
	if (
		(metadata.width && metadata.width > MAX_DIMENSION) ||
		(metadata.height && metadata.height > MAX_DIMENSION)
	) {
		image.resize(MAX_DIMENSION, MAX_DIMENSION, {
			fit: "inside",
			withoutEnlargement: true,
		});
	}

	const newMetadata = await image.metadata();
	if (!newMetadata) throw new ApiError(500, "Görsel meta verisi alınamadı.");
	if (!newMetadata.width || !newMetadata.height)
		throw new ApiError(500, "Görsel boyutu alınamadı.");

	let mimeType = "image/jpeg";

	do {
		let sharpFormat: keyof FormatEnum = "jpeg";
		if (extension === "jpeg") {
			sharpFormat = "jpeg";
			mimeType = "image/jpeg";
		} else if (extension === "jpg") {
			sharpFormat = "jpg";
			mimeType = "image/jpeg";
		} else if (extension === "png") {
			sharpFormat = "png";
			mimeType = "image/png";
		} else if (extension === "webp") {
			sharpFormat = "webp";
			mimeType = "image/webp";
		} else if (extension === "bmp") {
			sharpFormat = "jpeg";
			mimeType = "image/jpeg";
		} else if (extension === "gif") {
			sharpFormat = "gif";
			mimeType = "image/gif";
		} else if (extension === "heic") {
			sharpFormat = "jpeg";
			mimeType = "image/jpeg";
		} else if (extension === "heif") {
			sharpFormat = "jpeg";
			mimeType = "image/jpeg";
		} else if (extension === "tiff") {
			sharpFormat = "jpeg";
			mimeType = "image/jpeg";
		}

		outputBuffer = await image
			.toFormat(sharpFormat, { quality }) // Keep original format

			.toBuffer();

		if (quality > MINIMUM_QUALITY) {
			quality -= 5; // Reduce quality if file is still too large
		}
	} while (outputBuffer.length > MAXIMUM_FILE_SIZE && quality > MINIMUM_QUALITY); // 256KB limit

	// Upload to S3
	const fileNameWithoutExtension = file.name.split(".")[0];
	const year = new Date().getFullYear();
	const month = new Date().getMonth() + 1;
	const day = new Date().getDate();

	const fileName = `user-assets/${year}/${month}/${day}/${nanoid(6)}-${toSlug(fileNameWithoutExtension)}.${extension}`;

	const command = new PutObjectCommand({
		Bucket: env.S3_BUCKET,
		Key: fileName,
		Body: outputBuffer,
		ContentType: mimeType,
	});
	await S3.send(command).catch((error) => {
		console.error(error);
		throw new ApiError(500, "Dosya yükleme hatası.");
	});

	return {
		size: outputBuffer.length,
		extension,
		mime_type: mimeType,
		storage_path: fileName,
		width: newMetadata.width,
		height: newMetadata.height,
	};
};
