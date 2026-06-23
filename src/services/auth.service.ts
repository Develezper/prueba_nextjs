import { compare, hash } from "bcryptjs";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/src/lib/auth-session";
import { connectToDatabase } from "@/src/lib/mongodb";
import { sendWelcomeEmail } from "@/src/lib/mailer";
import User, { type UserDocument } from "@/src/models/User";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterUserResult {
  user: AuthUser;
}

export interface LoginUserResult {
  user: AuthUser;
  token: string;
}

const passwordSaltRounds = 10;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getJwtExpiration(): string {
  return process.env.JWT_EXPIRES_IN ?? "7d";
}

function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

async function removeRegisteredUser(userId: UserDocument["_id"]): Promise<void> {
  await User.deleteOne({ _id: userId });
}

function getWelcomeEmailFailure(error: unknown): Error {
  return new Error(
    "No se pudo enviar el correo de bienvenida. Intenta registrarte de nuevo.",
    {
      cause: error,
    },
  );
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterUserInput): Promise<RegisterUserResult> {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("Ya existe un usuario registrado con este email");
  }

  const hashedPassword = await hash(password, passwordSaltRounds);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  try {
    await sendWelcomeEmail({
      to: user.email,
      name: user.name,
    });
  } catch (error: unknown) {
    await removeRegisteredUser(user._id);
    throw getWelcomeEmailFailure(error);
  }

  return {
    user: toAuthUser(user),
  };
}

export async function loginUser({
  email,
  password,
}: LoginUserInput): Promise<LoginUserResult> {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  const authUser = toAuthUser(user);
  const token = await new SignJWT({
    userId: authUser.id,
    email: authUser.email,
    name: authUser.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(getJwtExpiration())
    .sign(getJwtSecretKey());

  return {
    user: authUser,
    token,
  };
}
