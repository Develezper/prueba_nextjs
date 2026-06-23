import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { CloudinaryImageUploadResult } from "@/src/types/cloudinary";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getUploadFolder(): string {
  return process.env.CLOUDINARY_UPLOAD_FOLDER ?? "recipe-app";
}

function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });
}

function toUploadResult(
  response: UploadApiResponse,
): CloudinaryImageUploadResult {
  return {
    publicId: response.public_id,
    secureUrl: response.secure_url,
    width: response.width,
    height: response.height,
    format: response.format,
    bytes: response.bytes,
  };
}

export async function uploadImageBuffer(
  buffer: Buffer,
  originalFilename: string,
): Promise<CloudinaryImageUploadResult> {
  configureCloudinary();

  const response = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: getUploadFolder(),
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        filename_override: originalFilename,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return an upload result"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

  return toUploadResult(response);
}

export async function deleteImageFromCloudinary(
  publicId: string,
): Promise<void> {
  configureCloudinary();

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}
