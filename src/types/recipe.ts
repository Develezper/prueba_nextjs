import type { Types } from "mongoose";

export type RecipeDifficulty = "Fácil" | "Media" | "Difícil";

export interface RecipeDocument {
  _id: Types.ObjectId;
  title: string;
  image: string;
  prepTime: string;
  difficulty: RecipeDifficulty;
  servings: string;
  ingredients: string[];
  steps: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecipeSeedInput {
  title: string;
  image: string;
  prepTime: string;
  difficulty: RecipeDifficulty;
  servings: string;
  ingredients: string[];
  steps: string[];
}
