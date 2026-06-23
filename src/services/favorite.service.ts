import { Types } from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import Favorite from "@/src/models/Favorite";
import {
  getRecipesByIds,
  recipeExistsById,
  type RecipeDocument,
} from "@/src/services/recipe.service";

export interface FavoriteStatus {
  recipeId: string;
  isFavorite: boolean;
}

function toObjectId(id: string, fieldName: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido`);
  }

  return new Types.ObjectId(id);
}

export async function addFavorite(
  userId: string,
  recipeId: string,
): Promise<FavoriteStatus> {
  await connectToDatabase();

  const userObjectId = toObjectId(userId, "Usuario");
  const recipeObjectId = toObjectId(recipeId, "Receta");
  const recipeExists = await recipeExistsById(recipeId);

  if (!recipeExists) {
    throw new Error("La receta seleccionada no existe");
  }

  await Favorite.updateOne(
    {
      user: userObjectId,
      recipe: recipeObjectId,
    },
    {
      $setOnInsert: {
        user: userObjectId,
        recipe: recipeObjectId,
      },
    },
    {
      upsert: true,
    },
  );

  return {
    recipeId,
    isFavorite: true,
  };
}

export async function removeFavorite(
  userId: string,
  recipeId: string,
): Promise<FavoriteStatus> {
  await connectToDatabase();

  await Favorite.deleteOne({
    user: toObjectId(userId, "Usuario"),
    recipe: toObjectId(recipeId, "Receta"),
  });

  return {
    recipeId,
    isFavorite: false,
  };
}

export async function listFavoriteRecipeIds(userId: string): Promise<string[]> {
  await connectToDatabase();

  const favorites = await Favorite.find({
    user: toObjectId(userId, "Usuario"),
  })
    .sort({ createdAt: -1 })
    .exec();

  return favorites.map((favorite) => favorite.recipe.toString());
}

export async function listFavoriteRecipes(
  userId: string,
): Promise<RecipeDocument[]> {
  const favoriteRecipeIds = await listFavoriteRecipeIds(userId);
  const recipes = await getRecipesByIds(favoriteRecipeIds);
  const recipeById = new Map(
    recipes.map((recipe) => [recipe._id.toString(), recipe]),
  );

  return favoriteRecipeIds
    .map((recipeId) => recipeById.get(recipeId))
    .filter((recipe): recipe is RecipeDocument => Boolean(recipe));
}
