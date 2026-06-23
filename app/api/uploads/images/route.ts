import { type NextRequest, NextResponse } from "next/server";
import { authCookieName, verifyAuthToken } from "@/src/lib/auth-session";
import {
  deleteImageFromCloudinary,
  uploadImageBuffer,
} from "@/src/lib/cloudinary";
import { deleteCloudinaryImageSchema } from "@/src/validations/upload.schema";

export const runtime = "nodejs";

const maxImageSizeBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No pudimos procesar la imagen";
}

function validateImageFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File)) {
    return null;
  }

  if (!allowedImageTypes.has(value.type)) {
    return null;
  }

  if (value.size <= 0 || value.size > maxImageSizeBytes) {
    return null;
  }

  return value;
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesión para subir imágenes" },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const imageFile = validateImageFile(formData.get("image"));

  if (!imageFile) {
    return NextResponse.json(
      {
        message:
          "Sube una imagen válida en formato JPG, PNG o WEBP de máximo 5 MB",
      },
      { status: 422 },
    );
  }

  try {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadedImage = await uploadImageBuffer(imageBuffer, imageFile.name);

    return NextResponse.json({ image: uploadedImage }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesión para eliminar imágenes" },
      { status: 401 },
    );
  }

  const body: unknown = await request.json();
  const parsedBody = deleteCloudinaryImageSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Selecciona una imagen válida",
      },
      { status: 422 },
    );
  }

  try {
    await deleteImageFromCloudinary(parsedBody.data.publicId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
