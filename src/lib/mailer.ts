import nodemailer, { type Transporter } from "nodemailer";

const gmailServiceName = "gmail";
const appName = "App de Recetas";

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

function getGmailUser(): string {
  return getRequiredEnv("GMAIL_USER");
}

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    service: gmailServiceName,
    auth: {
      user: getGmailUser(),
      pass: getRequiredEnv("GMAIL_APP_PASSWORD"),
    },
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: WelcomeEmailInput): Promise<void> {
  const transporter = createTransporter();
  const from = `${appName} <${getGmailUser()}>`;

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
