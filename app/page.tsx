import Link from "next/link";
import {
  RecipeCard,
  type RecipeCardProps,
} from "@/src/components/RecipeCard";
import {
  getRecipesCatalog as getRecipes,
  type RecipeDocument,
} from "@/src/services/recipe.service";

export const dynamic = "force-dynamic";

type RecipeDifficulty = RecipeCardProps["difficulty"];

function getStringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function getDifficulty(value: unknown): RecipeDifficulty {
  if (value === "Fácil" || value === "Media" || value === "Difícil") {
    return value;
  }

  return "Fácil";
}

function toRecipeCardProps(recipe: RecipeDocument): RecipeCardProps {
  return {
    image: getStringValue(recipe.image, "/window.svg"),
    title: getStringValue(recipe.title, "Receta sin título"),
    prepTime: getStringValue(recipe.prepTime, "Tiempo no disponible"),
    difficulty: getDifficulty(recipe.difficulty),
  };
}

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Catálogo de recetas
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">
            Encuentra una receta deliciosa para cocinar hoy
          </h1>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe._id.toString()}
                href={`/recipes/${recipe._id.toString()}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
              >
                <RecipeCard {...toRecipeCardProps(recipe)} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            Aún no hay recetas disponibles.
          </div>
        )}
      </section>
    </main>
  );
}
