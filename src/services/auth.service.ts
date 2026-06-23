import { compare, hash } from "bcryptjs";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/src/lib/auth-session";
import { connectToDatabase } from "@/src/lib/mongodb";
import { sendWelcomeEmail } from "@/src/lib/mailer";
import User, { type UserDocument } from "@/src/models/User";
import type {
  AuthUser,
  LoginUserInput,
  LoginUserResult,
  RegisterUserInput,
  RegisterUserResult,
  SeedDefaultUserInput,
  SeedDefaultUserResult,
} from "@/src/types/auth";

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
    // El correo de bienvenida no debe bloquear el alta local o productiva.
    console.warn("No se pudo enviar el correo de bienvenida", error);
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

export async function seedDefaultUser({
  name,
  email,
  password,
}: SeedDefaultUserInput): Promise<SeedDefaultUserResult> {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);
  const hashedPassword = await hash(password, passwordSaltRounds);

  // Upsert keeps the demo account idempotent so the seed can be run multiple times safely.
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!user) {
    throw new Error("No se pudo crear el usuario de prueba");
  }

  return {
    user: toAuthUser(user),
  };
}
