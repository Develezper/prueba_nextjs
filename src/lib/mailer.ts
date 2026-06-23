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

function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000"
  );
}

function buildWelcomeText(name: string, appUrl: string): string {
  return `Hola ${name},

Gracias por registrarte en ${appName}. Tu cuenta fue creada correctamente.

Puedes comenzar a explorar recetas visitando: ${appUrl}

Si no solicitaste este registro, ignora este correo.

— ${appName}`;
}

function buildWelcomeHtml(name: string, appUrl: string): string {
  const preheader = `Bienvenido a ${appName} — Explora recetas ahora.`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>
      body { margin:0; padding:0; font-family: Arial, sans-serif; background:#f3f4f6; color:#0f172a; }
      .container { max-width:600px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 18px rgba(15,23,42,0.08); }
      .header { background:linear-gradient(90deg,#06b6d4,#3b82f6); color:#fff; padding:24px; text-align:center; }
      .content { padding:24px; }
      .button { display:inline-block; background:#3b82f6; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; }
      .footer { padding:16px; font-size:12px; color:#64748b; text-align:center; }
      @media (max-width:600px){ .container{ margin:16px; } }
    </style>
  </head>
  <body>
    <span style="display:none !important; visibility:hidden; mso-hide:all;">${preheader}</span>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:20px;">${appName}</h1>
      </div>
      <div class="content">
        <p style="font-size:16px; margin:0 0 12px;">Hola ${name},</p>
        <p style="margin:0 0 18px;">Tu cuenta fue creada correctamente. Ya puedes explorar recetas y guardar tus preparaciones favoritas.</p>
        <p style="text-align:center; margin:28px 0;">
          <a href="${appUrl}" class="button">Explorar recetas</a>
        </p>
        <p style="margin:0 0 8px;">Si no creaste esta cuenta, ignora este correo o contáctanos.</p>
      </div>
      <div class="footer">
        <p style="margin:0 0 6px;">${appName} — <a href="${appUrl}" style="color:inherit; text-decoration:underline;">Visitar sitio</a></p>
        <p style="margin:0; font-size:11px;">Recibes este correo porque te registraste en ${appName}.</p>
      </div>
    </div>
  </body>
</html>`;
}

export async function sendWelcomeEmail({
  to,
  name,
}: WelcomeEmailInput): Promise<void> {
  const transporter = createTransporter();
  const from = `${appName} <${getGmailUser()}>`;
  const appUrl = getAppUrl();

  await transporter.sendMail({
    from,
    to,
    subject: `Bienvenida a ${appName}`,
    text: buildWelcomeText(name, appUrl),
    html: buildWelcomeHtml(name, appUrl),
  });
}
