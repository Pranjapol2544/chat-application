# Chat Application

Room chat MVP built with `Next.js`, `Auth.js`, `Prisma`, `PostgreSQL`, and `Socket.IO`.

## Current MVP

- Email/password registration and login
- Room list, room creation, and room joining
- Room message history
- Realtime message delivery
- English and Thai locale token structure
- Mobile-first room list and conversation flow

## Stack

- `Next.js 16` App Router
- `TypeScript`
- `Prisma`
- `PostgreSQL`
- `Auth.js` credentials auth
- `Socket.IO`
- `Tailwind CSS`
- `react-hook-form` + `zod`

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.example .env
```

3. Make sure PostgreSQL is running and the database exists

- Database name: `chat_application`
- Default local URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_application?schema=public"
```

4. Run migrations and seed

```bash
npm run db:migrate
npm run db:seed
```

5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_application?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
CHAT_SOCKET_DEBUG="false"
```

- Set `CHAT_SOCKET_DEBUG="true"` only when you want verbose socket logs in local development.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run db:migrate
npm run db:seed
```

## Seed Accounts

- `alice@example.com` / `password123`
- `bob@example.com` / `password123`
- `charlie@example.com` / `password123`

## Current Scope

Included:

- Room chat only
- Credentials auth
- Realtime room messages

Not included yet:

- Direct messages
- Presence
- Typing indicators
- Uploads
- Read receipts
- Notifications
