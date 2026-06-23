import nodemailer, { type Transporter } from "nodemailer";

interface WelcomeEmailInput {
  to: string;
  name: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSmtpPort(): number {
  const port = Number(getRequiredEnv("SMTP_PORT"));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer");
  }

  return port;
}

function getSmtpSecure(): boolean {
  return process.env.SMTP_SECURE === "true";
}

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: WelcomeEmailInput): Promise<void> {
  const transporter = createTransporter();
  const from = getRequiredEnv("SMTP_FROM");

  await transporter.sendMail({
    from,
    to,
    subject: "Bienvenida a la App de Recetas",
    text: `Hola ${name}, bienvenida a la App de Recetas. Ya puedes explorar y guardar tus preparaciones favoritas.`,
    html: `
      <main style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h1>Bienvenida a la App de Recetas</h1>
        <p>Hola ${name},</p>
        <p>Tu cuenta fue creada correctamente. Ya puedes explorar recetas y preparar algo delicioso.</p>
      </main>
    `,
  });
}
