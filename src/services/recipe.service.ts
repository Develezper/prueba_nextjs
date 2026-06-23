import mongoose, { Types } from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";

export interface RecipeDocument {
  _id: Types.ObjectId;
  [key: string]: unknown;
}

const recipeCollectionName = "recipes";

function getRecipeCollection() {
  return mongoose.connection.collection<RecipeDocument>(recipeCollectionName);
}

export async function getRecipesCatalog(): Promise<RecipeDocument[]> {
  await connectToDatabase();

  return getRecipeCollection().find({}).toArray();
}

export async function getRecipeById(
  id: string,
): Promise<RecipeDocument | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectToDatabase();

  return getRecipeCollection().findOne({ _id: new Types.ObjectId(id) });
}

export async function getRecipesByIds(ids: string[]): Promise<RecipeDocument[]> {
  const objectIds = ids
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (objectIds.length === 0) {
    return [];
  }

  await connectToDatabase();

  return getRecipeCollection()
    .find({
      _id: {
        $in: objectIds,
      },
    })
    .toArray();
}
