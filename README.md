# Recipes App

Recipes App is a Next.js App Router project built for a performance technical test. It uses TypeScript, MongoDB with Mongoose, Tailwind CSS, Shadcn UI-style base components, Lucide React, React Hook Form, Zod, JWT with `jose`, `bcryptjs`, and Nodemailer.

## Live Deployment

- Production URL: https://prueba-nextjs-ten.vercel.app/
- GitHub repository: [Develezper/prueba_nextjs](https://github.com/Develezper/prueba_nextjs)

## Requirements

- Bun
- MongoDB
- Gmail account with an App Password for the welcome email
- Cloudinary account if you want to use the image upload API

## Setup

Install dependencies:

```bash
bun install
```

Create your local environment file from `.env.example`.

## Environment Variables

```bash
# MongoDB
MONGODB_URI=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# Gmail / Nodemailer
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=
```

## Seed Data

Load the demo recipes into the database:

```bash
bun run seed:recipes
```

Create or refresh the default demo user:

```bash
bun run seed:user
```

Default demo credentials:

- Email: `demo@prueba-nextjs.com`
- Password: `DemoUser123!`

## Scripts

Start the development server:

```bash
bun run dev
```

Run lint:

```bash
bun run lint
```

Build for production:

```bash
bun run build
```

Start the production build:

```bash
bun run start
```

## Project Structure

- `app/`: routes, pages, and route handlers for the Next.js App Router.
- `src/components/`: reusable UI and form components.
- `src/lib/`: shared utilities for MongoDB, session, email, and error handling.
- `src/models/`: Mongoose models.
- `src/services/`: database access layer.
- `src/validations/`: Zod validation schemas.

## Note

Next.js 16 uses `proxy.ts` instead of the old `middleware.ts` convention.
`proxy.ts` is kept in this project to satisfy the JWT route protection requirement.
