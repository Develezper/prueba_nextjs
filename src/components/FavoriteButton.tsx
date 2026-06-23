"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getApiErrorMessage } from "@/src/lib/api-error";
import {
  addFavorite,
  removeFavorite,
} from "@/src/services/favorites.service";

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
  recipeTitle: string;
  refreshOnChange?: boolean;
}

function joinClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function FavoriteButton({
  recipeId,
  initialIsFavorite,
  isAuthenticated,
  recipeTitle,
  refreshOnChange = false,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLoading = isSubmitting || isPending;

  async function handleToggleFavorite(): Promise<void> {
    if (!isAuthenticated) {
      window.alert("Inicia sesión para guardar esta receta en favoritos.");
      return;
    }

    const previousState = isFavorite;
    setIsFavorite(!previousState);
    setIsSubmitting(true);

    try {
      const response = previousState
        ? await removeFavorite(recipeId)
        : await addFavorite(recipeId);

      setIsFavorite(response.isFavorite);

      if (refreshOnChange) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error: unknown) {
      setIsFavorite(previousState);
      window.alert(
        getApiErrorMessage(
          error,
          "No pudimos actualizar tus favoritos. Intenta de nuevo.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={
        isFavorite
          ? `Quitar ${recipeTitle} de favoritos`
          : `Guardar ${recipeTitle} en favoritos`
      }
      aria-pressed={isFavorite}
      disabled={isLoading}
      onClick={handleToggleFavorite}
      className={joinClassNames(
        "absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        isFavorite
          ? "text-emerald-700"
          : "text-slate-700 hover:text-slate-950",
      )}
    >
      <Bookmark
        className={joinClassNames("h-5 w-5", isFavorite && "fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}
