import { model, models, Schema, type Model, type Types } from "mongoose";

export const recipeCollectionName = "recipes";

export type RecipeDifficulty = "Fácil" | "Media" | "Difícil";

export interface RecipeDocument {
  _id: Types.ObjectId;
  title?: string;
  image?: string;
  prepTime?: string;
  difficulty?: RecipeDifficulty;
  servings?: string;
  ingredients?: string[];
  steps?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    prepTime: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Fácil", "Media", "Difícil"],
    },
    servings: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    steps: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    collection: recipeCollectionName,
    strict: false,
    timestamps: true,
    versionKey: false,
  },
);

export const Recipe: Model<RecipeDocument> =
  (models.Recipe as Model<RecipeDocument>) ??
  model<RecipeDocument>("Recipe", recipeSchema, recipeCollectionName);

export default Recipe;
