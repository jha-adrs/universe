import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import sharp from "sharp";
import config from "@/config/config";
import { logger } from "@/lib/logger";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadImageToS3(
    file,
    fileName,
    type
) {
    //   const resizedImageBuffer = await sharp(file)
    //     .resize(400, 500) // Specify your desired width or height for resizing
    //     .toBuffer();
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `post_files/images/${Date.now()}-${fileName}`,
        Body: file,
        ContentType: type,
        ACL: "private"
    };

    const command = new PutObjectCommand(params);
    const res = await s3Client.send(command);

    const getCommand = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
    return url;
}

export async function POST(request, response) {
    try {
        const formData = await request.formData();

        const file = formData.get("file")
        if (!file) {
            return NextResponse.json(
                { error: "File blob is required." },
                { status: 400 }
            );
        }

        const mimeType = file.type;
        const fileExtension = mimeType.split("/")[1];

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadImageToS3(
            buffer,
            uuid() + "." + fileExtension,
            mimeType
        );
        logger.info("Uploaded new video", url);
        return NextResponse.json({ success: 1, url });
    } catch (error) {
        console.error("Error uploading image:", error);
        NextResponse.json({ message: "Error uploading image" });
    }
}