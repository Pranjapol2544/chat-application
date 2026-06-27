---
name: chat-app-architecture
description: Define or refine the architecture of a Next.js chat application that uses Tailwind CSS, Prisma, Auth.js or NextAuth, and Socket.IO. Use when Codex needs to propose a folder structure, split responsibilities across app/features/lib/server layers, place realtime and database code, scaffold a new chat feature within the established architecture, or sanity-check whether a planned change fits the project's conventions.
---

# Chat App Architecture

## Overview

Use this skill to keep architecture decisions consistent across the chat application. Favor a feature-oriented structure on top of Next.js App Router, keep business logic out of UI components, and make database, auth, and realtime boundaries explicit before writing code.

## Workflow

1. Inspect the existing project structure before proposing changes.
2. Identify which layer the request belongs to: `app`, `features`, `lib`, `server`, `prisma`, or `types`.
3. Keep route files thin and move reusable logic into feature or server modules.
4. Prefer extending an existing feature boundary over creating a new top-level folder unless the domain is genuinely separate.
5. Return a concrete proposal: folders, responsibilities, key files, and any tradeoffs.

## Architecture Defaults

- Use `src/app` for routes, layouts, route handlers, and page-level composition.
- Use `src/features` for domain-specific UI, actions, validation schemas, and orchestration grouped by feature such as `auth`, `rooms`, `messages`, or `presence`.
- Use `src/lib` for shared utilities that are not tied to a single feature, such as `cn`, env parsing, date helpers, or generic client setup.
- Use `src/server` for server-only code such as Prisma access, auth configuration, permission checks, and realtime coordination that should never leak into client bundles.
- Use `prisma/` for schema, migrations, and seed logic.
- Use `src/types` only for cross-feature types that do not naturally belong to a single module.

Read [references/folder-structure.md](references/folder-structure.md) when you need the canonical folder layout or example file placement.

## Decision Rules

### Routing

- Keep pages and layouts focused on composition and data entry points.
- Put route-specific UI in the route file only when it is not reused elsewhere.
- Prefer route handlers for HTTP boundaries; move the implementation behind them into feature or server modules.

### Features

- Create a feature folder when the code spans UI, validation, actions, and data access for one domain concept.
- Keep feature internals close together: components, schemas, server actions, hooks, and view models.
- Name features by domain nouns, not technical layers.

### Server Boundaries

- Keep Prisma calls in server-only modules.
- Centralize auth helpers so session and permission checks are consistent.
- Treat Socket.IO setup, room membership rules, and message broadcast logic as server concerns even if clients consume them directly.

### Client Boundaries

- Keep client components focused on interaction, rendering, and local UI state.
- Validate user input with shared schemas at the boundary before it reaches database or socket logic.
- Avoid importing server-only helpers into client code.

## Realtime Guidance

- Model persistence first, then broadcast updates.
- Use sockets for live delivery, not as the primary source of truth.
- Ensure room membership and authorization checks happen before subscribe or emit flows.
- Store enough message metadata for replay from the database when the client reconnects.

## Expected Output

When asked to propose architecture, respond with:

1. The recommended folder structure or file placement.
2. The responsibility of each major module.
3. Any server/client boundary notes.
4. The next implementation steps, smallest first.

If the current codebase already has a pattern, preserve it unless it clearly blocks the requested work.
