# AI Content Studio

AI Content Studio is a modern SaaS dashboard for generating AI-powered blog posts, emails, code snippets, and image prompts using Next.js, TypeScript, MongoDB, Tailwind CSS, and shadcn/ui.

## Features

- Secure authentication with NextAuth credentials provider
- Responsive dashboard with sidebar, top navigation, and dark/light theme
- AI blog generation with tone, keywords, and word count controls
- AI email writer with type and style configuration
- Code assistant for generation, explanation, debugging, and refactoring
- Image prompt generator for cinematic AI art prompts
- Activity analytics and usage metrics
- Searchable, filterable, paginated history table
- Profile settings and password management
- OpenAI integration for AI responses
- MongoDB + Mongoose database models and API routes

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your values:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```bash
http://localhost:3000
```

## Seed Demo Data

Generate sample demo content and a demo user with this command:

```bash
npm run seed
```

Demo account:

- Email: `demo@ai-content-studio.com`
- Password: `Demo!234`

## API Endpoints

- `POST /api/auth/register` — register new users
- `POST /api/auth/forgot-password` — request password reset message
- `POST /api/generate/blog` — create AI blog content
- `POST /api/generate/email` — create AI emails
- `POST /api/generate/code` — create AI code responses
- `POST /api/generate/image` — create AI image prompts
- `GET /api/history` — list generation history
- `DELETE /api/history` — delete saved history entries
- `PATCH /api/profile` — update user profile
- `PATCH /api/profile/password` — change password

## Environment Variables

Use `.env.local` to define:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Tech Stack

- Next.js 15 App Router
- TypeScript
- MongoDB & Mongoose
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod validation
- Zustand state management
- TanStack Table
- Recharts analytics
- Lucide icons
- Framer Motion animations
- Sonner toast notifications

## License

This project is provided as-is for evaluation and customization.
