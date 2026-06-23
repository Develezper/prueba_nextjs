# App de Recetas

Aplicación web de recetas construida con Next.js App Router, TypeScript, MongoDB con Mongoose, Tailwind CSS, componentes base estilo Shadcn UI, Lucide React, React Hook Form, Zod, JWT con `jose`, `bcryptjs` y Nodemailer.

## Requisitos

- Bun
- MongoDB
- Cuenta de Gmail con App Password para el correo de bienvenida
- Cuenta de Cloudinary si se usa la API de subida de imágenes

## Configuración

Instala dependencias con Bun:

```bash
bun install
```

Crea el archivo local de variables de entorno tomando como referencia `.env.example`.

## Scripts

Ejecutar el servidor de desarrollo:

```bash
bun run dev
```

Ejecutar lint:

```bash
bun run lint
```

Generar build de producción:

```bash
bun run build
```

Levantar el build:

```bash
bun run start
```

## Estructura Principal

- `app/`: rutas, páginas y route handlers de Next.js App Router.
- `src/components/`: componentes reutilizables de UI y formularios.
- `src/lib/`: utilidades compartidas de MongoDB, sesión, correo y errores.
- `src/models/`: modelos de Mongoose.
- `src/services/`: capa de servicios para acceso a base de datos.
- `src/validations/`: esquemas de validación con Zod.
