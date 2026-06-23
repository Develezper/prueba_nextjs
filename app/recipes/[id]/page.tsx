import Image from "next/image";
import Link from "next/link";
import { getRecipeById, type RecipeDocument } from "@/src/services/recipe.service";

export const dynamic = "force-dynamic";

type RecipeDifficulty = "Fácil" | "Media" | "Difícil";

interface RecipeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface RecipeDetail {
  image: string;
  title: string;
  prepTime: string;
  difficulty: RecipeDifficulty;
  servings: string;
  ingredients: string[];
  steps: string[];
}

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

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toRecipeDetail(recipe: RecipeDocument): RecipeDetail {
  return {
    image: getStringValue(recipe.image, "/window.svg"),
    title: getStringValue(recipe.title, "Receta sin título"),
    prepTime: getStringValue(recipe.prepTime, "Tiempo no disponible"),
    difficulty: getDifficulty(recipe.difficulty),
    servings: getStringValue(recipe.servings, "Porciones no disponibles"),
    ingredients: getStringArray(recipe.ingredients),
    steps: getStringArray(recipe.steps),
  };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
        <section className="mx-auto flex max-w-3xl flex-col gap-5 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            No encontramos esta receta
          </h1>
          <p className="text-slate-600">
            Puede que la receta haya sido eliminada o que el enlace no sea
            correcto.
          </p>
          <Link
            href="/"
            className="mx-auto inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
          >
            Volver al catálogo
          </Link>
        </section>
      </main>
    );
  }

  const recipeDetail = toRecipeDetail(recipe);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <article className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Link
          href="/"
          className="w-fit text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
        >
          Volver al catálogo
        </Link>

        <header className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
          <div className="relative aspect-[16/10] min-h-72 w-full bg-slate-100 sm:aspect-[16/8]">
            <Image
              src={recipeDetail.image}
              alt={recipeDetail.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Detalle de receta
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">
              {recipeDetail.title}
            </h1>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Tiempo</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {recipeDetail.prepTime}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Dificultad</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {recipeDetail.difficulty}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Porciones</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {recipeDetail.servings}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">Ingredientes</h2>

            {recipeDetail.ingredients.length > 0 ? (
              <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-700">
                {recipeDetail.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-slate-600">
                No hay ingredientes registrados para esta receta.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold tracking-tight">Preparación</h2>

            {recipeDetail.steps.length > 0 ? (
              <ol className="mt-5 list-decimal space-y-4 pl-5 text-slate-700">
                {recipeDetail.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-slate-600">
                No hay pasos registrados para esta receta.
              </p>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
