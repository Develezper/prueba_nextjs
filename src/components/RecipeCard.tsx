import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export interface RecipeCardProps {
  image: string;
  title: string;
  prepTime: string;
  difficulty: "Fácil" | "Media" | "Difícil";
}

export function RecipeCard({
  image,
  title,
  prepTime,
  difficulty,
}: RecipeCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          aria-label={`Guardar receta ${title}`}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition-colors hover:bg-white hover:text-slate-950"
        >
          <Bookmark className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">Tiempo:</span> {prepTime}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {difficulty}
        </span>
      </CardContent>
    </Card>
  );
}
