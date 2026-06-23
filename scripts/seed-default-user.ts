import { seedDefaultUser } from "../src/services/auth.service";

interface ProcessWithBuiltinModule {
  getBuiltinModule?: (id: string) => unknown;
}

interface V8BuiltinModule {
  startupSnapshot?: {
    isBuildingSnapshot?: () => boolean;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isV8BuiltinModule(value: unknown): value is V8BuiltinModule {
  return isRecord(value);
}

function applyBunBsonFallback(): void {
  const currentProcess = process as unknown as ProcessWithBuiltinModule;
  const getBuiltinModule = currentProcess.getBuiltinModule?.bind(process);

  if (!getBuiltinModule) {
    return;
  }

  currentProcess.getBuiltinModule = (id: string): unknown => {
    const builtinModule = getBuiltinModule(id);

    if (id !== "v8" || !isV8BuiltinModule(builtinModule)) {
      return builtinModule;
    }

    // Bun's snapshot detection can interfere with BSON during seeding, so we force it off here.
    return {
      ...builtinModule,
      startupSnapshot: {
        ...builtinModule.startupSnapshot,
        isBuildingSnapshot: () => false,
      },
    };
  };
}

const defaultUser = {
  name: "Demo User",
  email: "demo@prueba-nextjs.com",
  password: "DemoUser123!",
} as const;

async function main(): Promise<void> {
  applyBunBsonFallback();

  const result = await seedDefaultUser(defaultUser);

  console.log(
    `Default user ready: ${result.user.email} / ${defaultUser.password}`,
  );
}

main()
  .catch((error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : "No pudimos crear el usuario de prueba.";

    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");

    await mongoose.default.disconnect();
  });
