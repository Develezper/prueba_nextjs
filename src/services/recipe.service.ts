import { Types } from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import Recipe, {
  type RecipeDifficulty,
  type RecipeDocument,
} from "@/src/models/Recipe";

export type { RecipeDocument } from "@/src/models/Recipe";

export interface RecipeSeedInput {
  title: string;
  image: string;
  prepTime: string;
  difficulty: RecipeDifficulty;
  servings: string;
  ingredients: string[];
  steps: string[];
}

export async function getRecipesCatalog(): Promise<RecipeDocument[]> {
  await connectToDatabase();

  return Recipe.find({}).exec();
}

export async function seedRecipes(
  recipes: RecipeSeedInput[],
): Promise<void> {
  await connectToDatabase();

  await Promise.all(
    recipes.map((recipe) =>
      Recipe.updateOne(
        {
          title: recipe.title,
        },
        {
          $set: recipe,
        },
        {
          upsert: true,
        },
      ).exec(),
    ),
  );
}

export async function getRecipeById(
  id: string,
): Promise<RecipeDocument | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectToDatabase();

  return Recipe.findById(id).exec();
}

export async function recipeExistsById(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }

  await connectToDatabase();

  const recipe = await Recipe.exists({ _id: new Types.ObjectId(id) });

  return Boolean(recipe);
}

export async function getRecipesByIds(ids: string[]): Promise<RecipeDocument[]> {
  const objectIds = ids
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (objectIds.length === 0) {
    return [];
  }

  await connectToDatabase();

  return Recipe.find({
    _id: {
      $in: objectIds,
    },
  }).exec();
}
