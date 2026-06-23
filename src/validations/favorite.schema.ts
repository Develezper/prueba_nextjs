import { z } from "zod";

export const favoriteRecipeSchema = z.object({
  recipeId: z.string().trim().min(1, "La receta es obligatoria"),
});
