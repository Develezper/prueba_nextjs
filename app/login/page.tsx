import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)]">
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
          >
            Volver al catálogo
          </Link>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Iniciar sesión
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950">
              Entra a tu cuenta y continúa explorando recetas
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Accede para preparar el camino hacia tus favoritos y mantener tu
              experiencia lista para la siguiente fase.
            </p>
          </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Bienvenido de nuevo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
            <p className="mt-6 text-center text-sm text-slate-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Regístrate
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
