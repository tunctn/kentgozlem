import { S3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// Allowed file types for security
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
	try {
		const { mimeType, fileSize } = await request.json();

		// Validate file type
		if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
			return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
		}

		// Validate file size
		if (fileSize > MAX_FILE_SIZE) {
			return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
		}

		// Generate unique filename
		const fileExtension = mimeType.split("/")[1];
		const fileName = `${nanoid()}.${fileExtension}`;

		// Create command for S3 upload
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: `uploads/${fileName}`,
			ContentType: mimeType,
		});

		// Generate presigned URL (valid for 5 minutes)
		const presignedUrl = await getSignedUrl(S3, command, {
			expiresIn: 300,
		});

		return NextResponse.json({
			presignedUrl,
			fileName,
		});
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
	}
}
