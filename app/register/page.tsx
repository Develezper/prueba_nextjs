import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getCurrentSession } from "@/src/lib/server-session";

export default async function RegisterPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/");
  }

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
              Crear cuenta
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950">
              Únete y recibe tu bienvenida a la App de Recetas
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Regístrate con una contraseña segura para activar tu cuenta y
              recibir el correo de bienvenida.
            </p>
          </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Crea tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-slate-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Inicia sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
