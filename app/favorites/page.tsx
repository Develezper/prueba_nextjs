import Link from "next/link";
import { redirect } from "next/navigation";
import { RecipeCard } from "@/src/components/RecipeCard";
import { toRecipeCardProps } from "@/src/lib/recipe-card-props";
import { getCurrentSession } from "@/src/lib/server-session";
import { listFavoriteRecipes } from "@/src/services/favorite.service";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const recipes = await listFavoriteRecipes(session.userId);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Tus favoritos
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">
            Recetas guardadas para cocinar después
          </h1>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id.toString()}
                {...toRecipeCardProps(recipe)}
                isAuthenticated
                isFavorite
                refreshOnFavoriteChange
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            <p>Aún no tienes recetas favoritas.</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
            >
              Explorar recetas
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
