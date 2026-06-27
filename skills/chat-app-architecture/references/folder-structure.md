# Suggested Layout

Use this as the default structure for the project unless the existing codebase has already chosen a different pattern worth preserving.

```text
src/
  app/
    (marketing)/
    (app)/
      rooms/
        [roomId]/
          page.tsx
      layout.tsx
    api/
      auth/
      socket/
  features/
    auth/
      components/
      schemas/
      server/
    rooms/
      components/
      server/
    messages/
      components/
      schemas/
      server/
    presence/
      server/
  lib/
    cn.ts
    env.ts
    utils.ts
  server/
    auth/
    db/
    sockets/
  types/
prisma/
  schema.prisma
  migrations/
```

## Placement Rules

- Put route entrypoints in `src/app`.
- Put feature-specific UI and orchestration in `src/features/<feature>`.
- Put server-only helpers shared across features in `src/server`.
- Put generic utilities with no feature ownership in `src/lib`.
- Keep Prisma client initialization in `src/server/db` or a similarly explicit server-only path.

## Feature Checklist

For a new feature, prefer adding:

- `components/` for UI pieces
- `schemas/` for Zod validation and feature-owned input contracts
- `server/` for server actions, queries, or permission logic

Treat those three folders as the default starter set, not a mandatory full template for every feature.

Only add these subfolders when the feature actually needs them:

- `hooks/` for custom React hooks
- `types/` for feature-owned types that do not naturally come from Zod or Prisma helpers
- `constants/` for shared literals or configuration used across files in the feature

Do not create empty folders just to match a template.
