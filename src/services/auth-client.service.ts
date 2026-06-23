import { postJson } from "@/src/lib/http-client";
import type {
  AuthUserResponse,
  LoginInput,
  RegisterInput,
} from "@/src/types/auth";

export function login(
  credentials: LoginInput,
): Promise<AuthUserResponse> {
  return postJson<AuthUserResponse, LoginInput>("/api/auth/login", credentials);
}

export function register(
  values: RegisterInput,
): Promise<AuthUserResponse> {
  return postJson<AuthUserResponse, RegisterInput>("/api/auth/register", values);
}

export function logout(): Promise<void> {
  return postJson<void, null>("/api/auth/logout", null);
}
