import { cookies } from "next/headers";
import { authCookieName, verifyAuthToken } from "@/src/lib/auth-session";
import type { AuthSession } from "@/src/types/auth";

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}
