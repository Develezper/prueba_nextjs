import { Types } from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import Recipe, { type RecipeDocument } from "@/src/models/Recipe";

export type { RecipeDocument } from "@/src/models/Recipe";

export async function getRecipesCatalog(): Promise<RecipeDocument[]> {
  await connectToDatabase();

  return Recipe.find({}).exec();
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
