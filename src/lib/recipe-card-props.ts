import type { RecipeCardProps } from "@/src/components/RecipeCard";
import type { RecipeDocument } from "@/src/services/recipe.service";

type RecipeDifficulty = RecipeCardProps["difficulty"];

function getStringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function getDifficulty(value: unknown): RecipeDifficulty {
  if (value === "Fácil" || value === "Media" || value === "Difícil") {
    return value;
  }

  return "Fácil";
}

export function toRecipeCardProps(recipe: RecipeDocument): RecipeCardProps {
  return {
    recipeId: recipe._id.toString(),
    image: getStringValue(recipe.image, "/recipe-placeholder.svg"),
    title: getStringValue(recipe.title, "Receta sin título"),
    prepTime: getStringValue(recipe.prepTime, "Tiempo no disponible"),
    difficulty: getDifficulty(recipe.difficulty),
  };
}
