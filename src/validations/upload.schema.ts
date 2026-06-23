import { z } from "zod";

export const deleteCloudinaryImageSchema = z.object({
  publicId: z.string().trim().min(1, "El publicId de la imagen es obligatorio"),
});
