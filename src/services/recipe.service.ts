import mongoose, { Types } from "mongoose";

export interface RecipeDocument {
  _id: Types.ObjectId;
  [key: string]: unknown;
}

const recipeCollectionName = "recipes";

function getRecipeCollection() {
  return mongoose.connection.collection<RecipeDocument>(recipeCollectionName);
}

export async function getRecipesCatalog(): Promise<RecipeDocument[]> {
  return getRecipeCollection().find({}).toArray();
}

export async function getRecipeById(
  id: string,
): Promise<RecipeDocument | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return getRecipeCollection().findOne({ _id: new Types.ObjectId(id) });
}