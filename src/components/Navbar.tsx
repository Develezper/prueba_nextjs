import Link from "next/link";
import { LogoutButton } from "@/src/components/auth/LogoutButton";
import { getCurrentSession } from "@/src/lib/server-session";

export async function Navbar() {
  const session = await getCurrentSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-4 px-6 py-4 text-slate-950 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            Recetas
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <Link
              href="/"
              className="transition-colors hover:text-emerald-700"
            >
              Inicio
            </Link>
            <Link
              href="/favorites"
              className="transition-colors hover:text-emerald-700"
            >
              Favoritos
            </Link>
          </div>
        </div>

        {session ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              Hola,{" "}
              <span className="font-semibold text-slate-950">
                {session.name}
              </span>
            </p>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-slate-950 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Registrarse
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
