export interface AuthSession {
  userId: string;
  name: string;
  email: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthUserResponse {
  user: AuthUser;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface RegisterUserResult {
  user: AuthUser;
}

export interface LoginUserResult {
  user: AuthUser;
  token: string;
}

export interface SeedDefaultUserInput {
  name: string;
  email: string;
  password: string;
}

export interface SeedDefaultUserResult {
  user: AuthUser;
}
