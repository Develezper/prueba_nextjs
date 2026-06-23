import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Selecciona una receta válida");

export const favoriteRecipeSchema = z.object({
  recipeId: objectIdSchema,
});
