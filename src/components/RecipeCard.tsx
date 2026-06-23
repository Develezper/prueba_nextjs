import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/src/components/FavoriteButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export interface RecipeCardProps {
  recipeId: string;
  image: string;
  title: string;
  prepTime: string;
  difficulty: "Fácil" | "Media" | "Difícil";
  isFavorite?: boolean;
  isAuthenticated?: boolean;
  refreshOnFavoriteChange?: boolean;
}

export function RecipeCard({
  recipeId,
  image,
  title,
  prepTime,
  difficulty,
  isFavorite = false,
  isAuthenticated = false,
  refreshOnFavoriteChange = false,
}: RecipeCardProps) {
  const recipeHref = `/recipes/${recipeId}`;

  return (
    <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Link
          href={recipeHref}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <FavoriteButton
          recipeId={recipeId}
          initialIsFavorite={isFavorite}
          isAuthenticated={isAuthenticated}
          recipeTitle={title}
          refreshOnChange={refreshOnFavoriteChange}
        />
      </div>

      <Link
        href={recipeHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
      >
        <CardHeader className="space-y-2 pb-3">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Tiempo:</span>{" "}
            {prepTime}
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {difficulty}
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
