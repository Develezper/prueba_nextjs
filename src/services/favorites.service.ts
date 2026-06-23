import { deleteJson, postJson } from "@/src/lib/http-client";
import type { FavoriteApiResponse } from "@/src/types/favorite";

const favoritesApiPath = "/api/favorites";

export function addFavorite(recipeId: string): Promise<FavoriteApiResponse> {
  return postJson<FavoriteApiResponse, { recipeId: string }>(
    favoritesApiPath,
    { recipeId },
  );
}

export function removeFavorite(recipeId: string): Promise<FavoriteApiResponse> {
  return deleteJson<FavoriteApiResponse>(favoritesApiPath, {
    params: { recipeId },
  });
}
