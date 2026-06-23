import { type NextRequest, NextResponse } from "next/server";
import { authCookieName, verifyAuthToken } from "@/src/lib/auth-session";
import {
  addFavorite,
  listFavoriteRecipeIds,
  removeFavorite,
} from "@/src/services/favorite.service";
import { favoriteRecipeSchema } from "@/src/validations/favorite.schema";

export const runtime = "nodejs";

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No pudimos procesar tus favoritos";
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesión para ver tus favoritos" },
      { status: 401 },
    );
  }

  const favoriteIds = await listFavoriteRecipeIds(session.userId);

  return NextResponse.json({ favoriteIds }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesión para guardar favoritos" },
      { status: 401 },
    );
  }

  const body: unknown = await request.json();
  const parsedBody = favoriteRecipeSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Selecciona una receta válida",
      },
      { status: 422 },
    );
  }

  try {
    const result = await addFavorite(session.userId, parsedBody.data.recipeId);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      { message: "Debes iniciar sesión para eliminar favoritos" },
      { status: 401 },
    );
  }

  const recipeId = request.nextUrl.searchParams.get("recipeId");
  const parsedBody = favoriteRecipeSchema.safeParse({ recipeId });

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Selecciona una receta válida",
      },
      { status: 422 },
    );
  }

  try {
    const result = await removeFavorite(session.userId, parsedBody.data.recipeId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
