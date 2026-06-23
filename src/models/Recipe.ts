import { model, models, Schema, type Model, type Types } from "mongoose";

export const recipeCollectionName = "recipes";

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
