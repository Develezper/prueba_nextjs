import { NextResponse } from "next/server";
import { authCookieMaxAge, authCookieName } from "@/src/lib/auth-session";
import { loginUser } from "@/src/services/auth.service";
import { loginSchema } from "@/src/validations/auth.schema";

export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo iniciar sesión";
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Revisa los datos del formulario",
      },
      { status: 422 },
    );
  }

  try {
    const { token, user } = await loginUser(parsedBody.data);
    const response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set({
      name: authCookieName,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: authCookieMaxAge,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    const status =
      error instanceof Error && error.message === "Credenciales inválidas"
        ? 401
        : 500;

    return NextResponse.json({ message }, { status });
  }
}
