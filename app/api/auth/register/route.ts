import { NextResponse } from "next/server";
import { registerUser } from "@/src/services/auth.service";
import { registerSchema } from "@/src/validations/auth.schema";

export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo registrar el usuario";
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsedBody = registerSchema.safeParse(body);

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
    const result = await registerUser(parsedBody.data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
