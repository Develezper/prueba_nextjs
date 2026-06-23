import { model, models, Schema, type Model } from "mongoose";
import type { RecipeDocument } from "@/src/types/recipe";

export const recipeCollectionName = "recipes";

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    prepTime: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Fácil", "Media", "Difícil"],
    },
    servings: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      default: [],
    },
    steps: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      default: [],
    },
  },
  {
    collection: recipeCollectionName,
    timestamps: true,
    versionKey: false,
  },
);

export const Recipe: Model<RecipeDocument> =
  (models.Recipe as Model<RecipeDocument>) ??
  model<RecipeDocument>("Recipe", recipeSchema, recipeCollectionName);

export default Recipe;
