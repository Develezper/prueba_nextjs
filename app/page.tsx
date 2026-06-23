import { RecipeCard } from "@/src/components/RecipeCard";
import { toRecipeCardProps } from "@/src/lib/recipe-card-props";
import { getCurrentSession } from "@/src/lib/server-session";
import { listFavoriteRecipeIds } from "@/src/services/favorite.service";
import { getRecipesCatalog as getRecipes } from "@/src/services/recipe.service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getCurrentSession();
  const recipes = await getRecipes();
  const favoriteIds = session
    ? new Set(await listFavoriteRecipeIds(session.userId))
    : new Set<string>();

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
            {recipes.map((recipe) => {
              const recipeId = recipe._id.toString();

              return (
                <RecipeCard
                  key={recipeId}
                  {...toRecipeCardProps(recipe)}
                  isAuthenticated={Boolean(session)}
                  isFavorite={favoriteIds.has(recipeId)}
                />
              );
            })}
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
