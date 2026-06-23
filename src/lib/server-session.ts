import { cookies } from "next/headers";
import {
  authCookieName,
  type AuthSession,
  verifyAuthToken,
} from "@/src/lib/auth-session";

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}
