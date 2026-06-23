import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prueba Next.js",
  description: "Aplicación de recetas de cocina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
