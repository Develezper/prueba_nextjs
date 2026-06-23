import { jwtVerify, type JWTPayload } from "jose";

export const authCookieName = "auth_token";
export const authCookieMaxAge = 60 * 60 * 24 * 7;

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return new TextEncoder().encode(secret);
}

function toAuthSession(payload: JWTPayload): AuthSession | null {
  const { userId, name, email } = payload;

  if (
    typeof userId !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    return null;
  }

  return {
    userId,
    name,
    email,
  };
}

export async function verifyAuthToken(
  token: string,
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return toAuthSession(payload);
  } catch {
    return null;
  }
}
